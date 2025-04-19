import React, { useRef, useMemo, useCallback } from 'react';
import PropTypes, { node } from 'prop-types';
import { Tree } from 'antd';
import useDragDrop from '../../../hooks/useDragDrop.js';
import styles from '../../../css/dashboard/rbac/RoleDetails.module.css';

const getSafeArray = value => (Array.isArray(value) ? value : []);
const createNodeKey = (type, id) => `${type}-${id}`;

const RoleDetails = ({ role, permissions, onDropPermission, onRemovePermission }) => {
  const containerRef = useRef(null);
  const { handleDragStart, handleDragOver, handleDrop } = useDragDrop();

  const rolePermissions = useMemo(() => getSafeArray(role?.permissions), [role]);

  const permissionNodes = useMemo(
    () =>
      permissions
        .filter(permission => rolePermissions.includes(permission.id))
        .map(permission => ({
          title: permission.name,
          key: createNodeKey('permission', permission.id),
          draggable: true,
          data: { type: 'permission', permissionId: permission.id },
        })),
    [permissions, rolePermissions]
  );

  const treeData = useMemo(
    () => (role ? [{ title: role.name, key: createNodeKey('role', role.id), children: permissionNodes }] : []),
    [role, permissionNodes]
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
          onRemovePermission(role.id, data.permissionId);
        }
      }
    },
    [onRemovePermission, role]
  );

  // 外部拖放捕获，先于 Tree.onDrop
  const handleContainerDropCapture = useCallback(
    e => {
      handleDragOver(e);
      const data = handleDrop(e);
      if (!data) return;
      const permissionId = data.version === '2.0' ? data.id : data.permissionId;
      if (!permissionId || !permissions.some(p => p.id === permissionId)) return;
      if (rolePermissions.includes(permissionId)) return;
      onDropUser(role.id, data);
    },
    [handleDragOver, handleDrop, onDropPermission, permissions, rolePermissions, role]
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
        key={`tree-${role.id}-${treeData.length}`}
        draggable
        blockNode
        titleRender={nodeData => {
          if (nodeData.key.startsWith('permission-')) {
            return (
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, { type: 'permission', permissionId: nodeData.data.permissionId })}
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

RoleDetails.propTypes = {
  role: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    permissions: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
  }),
  permissions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDropPermission: PropTypes.func.isRequired,
  onRemovePermission: PropTypes.func.isRequired,
};

export default React.memo(RoleDetails);