import React, { useRef, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Tree } from 'antd';
import useDragDrop from '../../../hooks/useDragDrop.js';
import styles from '../../../css/dashboard/rbac/UserDetails.module.css';

const getSafeArray = value => (Array.isArray(value) ? value : []);
const createNodeKey = (type, id) => `${type}-${id}`;

const UserDetails = ({ user, roles, permissions, onDropRole, onRemoveRole }) => {
  const containerRef = useRef(null);
  const { handleDragStart, handleDragOver, handleDrop } = useDragDrop();

  const userRoles = useMemo(() => getSafeArray(user?.roles), [user]);

  const roleNodes = useMemo(
    () =>
      roles
        .filter(role => userRoles.includes(role.id))
        .map(role => ({
          title: role.name,
          key: createNodeKey('role', role.id),
          draggable: true,
          data: { type: 'role', roleId: role.id },
          children: getSafeArray(role.permissions)
            .filter(pid => permissions.some(p => p.id === pid))
            .map(pid => ({
              title: permissions.find(p => p.id === pid)?.name || '',
              key: createNodeKey('permission', pid)
            }))
        })),
    [roles, userRoles, permissions]
  );

  const treeData = useMemo(
    () => (user ? [{ title: user.name, key: createNodeKey('user', user.id), children: roleNodes }] : []),
    [user, roleNodes]
  );

  // 当内部节点拖出时删除
  const handleDragEnd = useCallback(
    e => {
      const { clientX, clientY, dataTransfer } = e;
      const rect = containerRef.current?.getBoundingClientRect();
      if (
        rect &&
        (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom)
      ) {
        const raw = dataTransfer.getData('application/json');
        const data = JSON.parse(raw);
        if (data?.roleId) {
          onRemoveRole(user.id, data.roleId);
        }
      }
    },
    [onRemoveRole, user]
  );

  // 外部拖放捕获，先于 Tree.onDrop
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

  if (!user) return <div className={styles.noUserSelected}>请选择一个用户</div>;

  return (
    <div
      ref={containerRef}
      className={styles.userDetails}
      onDragOver={handleDragOver}
      onDropCapture={handleContainerDropCapture}
    >
      <h4>{user.name}'s Details</h4>
      <Tree
        treeData={treeData}
        key={`tree-${user.id}-${treeData.length}`}
        draggable
        blockNode
        titleRender={nodeData => {
          if (nodeData.key.startsWith('role-')) {
            return (
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, { type: 'role', roleId: nodeData.data.roleId })}
                style={{ cursor: 'move' }}
              >
                {nodeData.title}
              </div>
            );
          }
          return <span>{nodeData.title}</span>;
        }}
        onDragEnd={handleDragEnd}
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

export default React.memo(UserDetails);
