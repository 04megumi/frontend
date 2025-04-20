import React, { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Tree, Spin, message } from 'antd';
import useDragDrop from '../../../hooks/useDragDrop.js';
import styles from '../../../css/dashboard/rbac/UserDetails.module.css';
import { loadUser } from "../../../api/user.js"
import { loadRole } from "../../../api/role.js"

const getSafeArray = value => (Array.isArray(value) ? value : []);
const createNodeKey = (type, id) => `${type}-${id}`;

const UserDetails = ({ userName, user, roles, permissions, onDropRole, onRemoveRole }) => {
  const containerRef = useRef(null);
  const draggedRoleRef = useRef(null);
  const { handleDragStart, handleDragOver, handleDrop } = useDragDrop();
  const userRoles = useMemo(() => getSafeArray(user?.roles), [user]);
  
  // 新增状态管理
  const [roleIds, setRoleIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roleCache, setRoleCache] = useState({}); // 角色数据缓存

  // 加载用户角色数据
  useEffect(() => {
    if (!userName) return;
    
    const fetchUserRoles = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await loadUser(userName);
        if (response.success) {
          setRoleIds(getSafeArray(response.data.data?.roleIds));
        } else {
          throw new Error(response.data?.msg || 'Failed to load user roles');
        }
      } catch (err) {
        setError(err.message);
        message.error(`加载用户角色失败: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserRoles();
  }, [userName]);

  // 加载角色权限数据
  useEffect(() => {
    if (!roleIds.length) return;
    
    const fetchRoles = async () => {
      const newCache = {...roleCache};
      let hasNewData = false;
      
      try {
        await Promise.all(roleIds.map(async roleId => {
          if (!newCache[roleId]) {
            const response = await loadRole(roleId);
            if (response.data?.success) {
              newCache[roleId] = getSafeArray(response.data.data?.permissionIds);
              hasNewData = true;
            }
          }
        }));
        
        if (hasNewData) {
          setRoleCache(newCache);
        }
      } catch (err) {
        message.error(`加载角色权限失败: ${err.message}`);
      }
    };
    
    fetchRoles();
  }, [roleIds]);

  // 生成树形数据
  const treeData = useMemo(() => {
    return roleIds.map(roleId => ({
      title: roleId,
      key: createNodeKey('role', roleId),
      draggable: true,
      data: { type: 'role', roleId: roleId },
      children: getSafeArray(roleCache[roleId]).map(pid => ({
        title: pid,
        key: createNodeKey('permission', pid)
      }))
    }));
  }, [roleIds, roleCache]);

  const handleDragEnd = useCallback(
    e => {
      const { clientX, clientY } = e;
      const rect = containerRef.current?.getBoundingClientRect();
      if (
        rect &&
        (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom)
      ) {
        const roleId = draggedRoleRef.current;
        if (roleId) {
          onRemoveRole(user.id, roleId);
        }
      }
      draggedRoleRef.current = null;
    },
    [onRemoveRole, user]
  );

  const handleContainerDropCapture = useCallback(
    e => {
      handleDragOver(e);
      const data = handleDrop(e);
      if (!data) return;
      const roleId = data.version === '2.0' ? data.id : data.roleId;
      if (!roleId || !roles.some(r => r.id === roleId)) return;
      if (userRoles.includes(roleId)) return;
      onDropRole(user.id, data);
    },
    [handleDragOver, handleDrop, onDropRole, roles, userRoles, user]
  );

  if (!userName) return <div className={styles.noUserSelected}>请选择一个用户</div>;
  
  if (loading) return <Spin tip="加载中..." />;
  if (error) return <div className={styles.error}>加载失败: {error}</div>;

  return (
    <div
      ref={containerRef}
      className={styles.userDetails}
      onDragOver={handleDragOver}
      onDropCapture={handleContainerDropCapture}
    >
      <h4>{userName}'s Details</h4>
      <Tree
        treeData={treeData}
        key={`tree-${userName}-${treeData.length}`}
        draggable
        blockNode
        titleRender={nodeData => {
          if (nodeData.key.startsWith('role-')) {
            const roleId = nodeData.data.roleId;
            return (
              <div
                draggable
                onDragStart={e => {
                  draggedRoleRef.current = roleId;
                  handleDragStart(e, { version: '2.0', type: 'role', id: roleId });
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

UserDetails.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
  }),
  roles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      permissions: PropTypes.array
    })
  ).isRequired,
  permissions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  onDropRole: PropTypes.func.isRequired,
  onRemoveRole: PropTypes.func.isRequired
};

UserDetails.defaultProps = {
  user: null
};

export default React.memo(UserDetails);
