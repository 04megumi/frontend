import React, { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Tree, Spin, message } from 'antd';
import useDragDrop from '../../../hooks/useDragDrop';
import styles from '../../../css/dashboard/rbac/RoleDetails.module.css';
import { loadRole } from "../../../api/role.js";

const getSafeArray = v => Array.isArray(v) ? v : [];
const createNodeKey = (type, id) => `${type}-${id}`;

const RoleDetails = ({ roleId, role, permissions, onDropPermission, onRemovePermission }) => {
  const containerRef = useRef(null);
  const draggedPermRef = useRef(null);
  const { handleDragStart, handleDragOver, handleDrop } = useDragDrop();
  
  // 新增状态管理
  const [permIds, setPermIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roleDetails, setRoleDetails] = useState(null);

  // 加载角色权限数据
  useEffect(() => {
    if (!roleId) return;
    
    const fetchRolePermissions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await loadRole(roleId);
        if (response.success) {
          setRoleDetails(response.data.data);
          setPermIds(getSafeArray(response.data.data?.permissionIds));
        } else {
          throw new Error(response.data?.msg || 'Failed to load role permissions');
        }
      } catch (err) {
        setError(err.message);
        message.error(`加载角色权限失败: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRolePermissions();
  }, [roleId]);

  // 构建树形节点数据
  const treeData = useMemo(
    () => roleDetails ? [{
      title: roleDetails.name,
      key: createNodeKey('role', roleDetails.id),
      children: permIds.map(pid => ({
        title: permissions.find(p => p.id === pid)?.name || '',
        key: createNodeKey('permission', pid),
        draggable: true,
        data: { type: 'permission', permissionId: pid }
      }))
    }] : [],
    [roleDetails, permIds, permissions]
  );

  // 捕获外部 Drop 事件，添加新权限
  const handleContainerDropCapture = useCallback(
    e => {
      handleDragOver(e);
      const data = handleDrop(e);
      if (data?.type === 'permission') {
        const pid = data.version === '2.0' ? data.id : data.permissionId;
        if (pid && !permIds.includes(pid)) {
          onDropPermission(roleDetails.id, data);
        }
      }
    },
    [handleDragOver, handleDrop, onDropPermission, permIds, roleDetails]
  );

  // 节点拖出容器触发删除
  const handleDragEnd = useCallback(
    e => {
      const { clientX, clientY } = e;
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect && (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom)) {
        const pid = draggedPermRef.current;
        if (pid) {
          onRemovePermission(roleDetails.id, pid);
        }
      }
      draggedPermRef.current = null;
    },
    [onRemovePermission, roleDetails]
  );

  if (!roleId) return <div className={styles.noRoleSelected}>请选择一个角色</div>;
  if (loading) return <Spin tip="加载中..." />;
  if (error) return <div className={styles.error}>加载失败: {error}</div>;

  return (
    <div
      ref={containerRef}
      className={styles.roleDetails}
      onDragOver={handleDragOver}
      onDropCapture={handleContainerDropCapture}
    >
      <h4>{roleId || '角色'}的权限</h4>
      <Tree
        treeData={treeData}
        draggable
        blockNode
        titleRender={nodeData => {
          if (nodeData.key.startsWith('permission-')) {
            const pid = nodeData.data.permissionId;
            return (
              <div
                draggable
                onDragStart={e => {
                  draggedPermRef.current = pid;
                  handleDragStart(e, { version: '2.0', type: 'permission', id: pid });
                }}
                onDragEnd={handleDragEnd}
                style={{ cursor: 'move' }}
              >
                {nodeData.title}
              </div>
            );
          }
          return <span>{nodeData.title}</span>;
        }}
      />
    </div>
  );
};

RoleDetails.propTypes = {
  roleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  role: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    permissions: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    )
  }),
  permissions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  onDropPermission: PropTypes.func.isRequired,
  onRemovePermission: PropTypes.func.isRequired
};

RoleDetails.defaultProps = {
  roleId: null,
  role: null
};

export default React.memo(RoleDetails);
