import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Tree } from 'antd';
import useDragDrop from '../../../hooks/useDragDrop.js';
import styles from '../../../css/dashboard/rbac/UserDetails.module.css';

const UserDetails = ({ user, roles, permissions, onRemoveRole, onDropRole }) => {
  if (!user) return <div className={styles.noUserSelected}>请选择一个用户</div>;

  const { handleDrop } = useDragDrop();
  const containerRef = useRef(null);
  const [draggedRoleId, setDraggedRoleId] = useState(null);

  const userRoles = Array.isArray(user.roles) ? user.roles : [];

  const roleNodes = roles
    .filter(role => userRoles.includes(role.id))
    .map(role => {
      const rolePermissionIds = Array.isArray(role.permissions) ? role.permissions : [];
      const permissionNodesForRole = permissions
        .filter(permission => rolePermissionIds.includes(permission.id))
        .map(permission => ({
          title: permission.name,
          key: `permission-${permission.id}`,
        }));
      return {
        title: role.name,
        key: `role-${role.id}`,
        draggable: true,
        data: { type: 'role', roleId: role.id },
        children: permissionNodesForRole,
      };
    });

  const treeData = [
    {
      title: user.name,
      key: `user-${user.id}`,
      children: roleNodes,
    },
  ];

  const titleRender = (nodeData) => {
    if (nodeData.key.startsWith('role-')) {
      return (
        <div
          draggable
          onDragStart={(e) => {
            const roleId = nodeData.data.roleId;
            e.dataTransfer.setData('application/json', JSON.stringify({ type: 'role', roleId }));
            setDraggedRoleId(roleId);
          }}
          style={{ cursor: 'move' }}
        >
          {nodeData.title}
        </div>
      );
    }
    return <span>{nodeData.title}</span>;
  };

  const handleTreeDrop = (info) => {
    // 如果你将来想支持 Tree 内部重新排序，可以在这里加逻辑
    console.log("Tree 内部节点 onDrop", info);
  };

  const handleDragEnd = (e) => {
    if (!draggedRoleId) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      onRemoveRole(user.id, draggedRoleId);
    }
    setDraggedRoleId(null);
  };

  return (
    <div
      ref={containerRef}
      className={styles.userDetails}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        e.preventDefault();
        const data = handleDrop(e);
        console.log("UserDetails 外部 onDrop 捕获数据:", data);
        if (data && data.type === "role") {
          console.log("调用 onDropRole 回调:", user.id, data.roleId);
          onDropRole(user.id, data.roleId);
        }
      }}
    >
      <h4>{user.name}'s Details</h4>
      <Tree
        treeData={treeData}
        draggable
        blockNode
        allowDrop={() => true}
        titleRender={titleRender}
        onDragEnd={handleDragEnd}
        onDrop={handleTreeDrop}
      />
    </div>
  );
};

UserDetails.propTypes = {
  user: PropTypes.object,
  roles: PropTypes.array.isRequired,
  permissions: PropTypes.array.isRequired,
  onRemoveRole: PropTypes.func.isRequired,
  onDropRole: PropTypes.func.isRequired,
};

export default UserDetails;
