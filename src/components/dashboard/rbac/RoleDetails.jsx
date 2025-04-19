import React, { useRef, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Tree } from 'antd';
import useDragDrop from '../../../hooks/useDragDrop';
import styles from '../../../css/dashboard/rbac/RoleDetails.module.css';

const getSafeArray = v => Array.isArray(v) ? v : [];
const createNodeKey = (type, id) => `${type}-${id}`;

const RoleDetails = ({ role, permissions, onDropPermission, onRemovePermission }) => {
  const containerRef = useRef(null);
  const draggedPermRef = useRef(null);
  const { handleDragStart, handleDragOver, handleDrop } = useDragDrop();
  const permIds = useMemo(() => getSafeArray(role?.permissions), [role]);

  // 构建树形节点数据
  const treeData = useMemo(
    () => role ? [{
      title: role.name,
      key: createNodeKey('role', role.id),
      children: permIds.map(pid => ({
        title: permissions.find(p => p.id === pid)?.name || '',
        key: createNodeKey('permission', pid),
        draggable: true,
        data: { type: 'permission', permissionId: pid }
      }))
    }] : [],
    [role, permIds, permissions]
  );

  // 捕获外部 Drop 事件，添加新权限
  const handleContainerDropCapture = useCallback(
    e => {
      handleDragOver(e);
      const data = handleDrop(e);
      if (data?.type === 'permission') {
        const pid = data.version === '2.0' ? data.id : data.permissionId;
        if (pid && !permIds.includes(pid)) {
          onDropPermission(role.id, data);
        }
      }
    },
    [handleDragOver, handleDrop, onDropPermission, permIds, role]
  );

  // 节点拖出容器触发删除
  const handleDragEnd = useCallback(
    e => {
      const { clientX, clientY } = e;
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect && (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom)) {
        const pid = draggedPermRef.current;
        if (pid) {
          onRemovePermission(role.id, pid);
        }
      }
      draggedPermRef.current = null;
    },
    [onRemovePermission, role]
  );

  if (!role) return <div className={styles.noRoleSelected}>请选择一个角色</div>;

  return (
    <div
      ref={containerRef}
      className={styles.roleDetails}
      onDragOver={handleDragOver}
      onDropCapture={handleContainerDropCapture}
    >
      <h4>{role.name}'s Permissions</h4>
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
  role: null
};

export default React.memo(RoleDetails);
