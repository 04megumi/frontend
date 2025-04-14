import React from 'react';
import PropTypes from 'prop-types';
import { DownOutlined } from '@ant-design/icons';
import { Tree } from 'antd';
import styles from '../../../css/dashboard/rbac/UserDetails.module.css';

const UserDetails = ({ user, roles, permissions, onRemoveRole, onDropRole }) => {
  if (!user) {
    return <div className={styles.noUserSelected}>请选择一个用户</div>;
  }

  {/* const userRoles = roles.filter(role => user.roles.includes(role.id));
  const userPermissions = permissions.filter(permission => {
    return userRoles.some(role => role.permissions.includes(permission.id));
  }); */}

  const userRoles = Array.isArray(user.roles) ? user.roles : [];  // 确保是数组
  const userPermissions = Array.isArray(user.permissions) ? user.permissions : [];

  // 构造角色子树
  const roleNodes = roles
    .filter(role => userRoles.includes(role.id)) // 获取该用户的角色
    .map(role => ({
      title: role.name,
      key: `role-${role.id}`,
      draggable: true, // 使角色节点可拖动，用于移除角色
      data: { type: 'role', id: role.id }, // 给每个角色加上数据，方便在拖放时获取
    }));

  // 构造权限子树
  const permissionNodes = permissions
    .filter(permission => userPermissions.includes(permission.id)) // 获取该用户的权限
    .map(permission => ({
      title: permission.name,
      key: `permission-${permission.id}`,
    }));

  // 构造树形数据
  const treeData = [
    {
      title: user.name,
      key: `user-${user.id}`,
      children: [
        {
          title: '角色',
          key: 'roles',
          children: roleNodes,
        },
        {
          title: '权限',
          key: 'permissions',
          children: permissionNodes,
        },
      ],
    },
  ];

  // 处理拖放角色到用户的事件
  const handleDrop = info => {
    const data = JSON.parse(info.dragNode.props.data?.dataTransfer);
    if (data?.type === 'role') {
      onDropRole(user.id, data.id); // 调用外部传入的 onDropRole 方法来赋予角色
    }
  };

  // 阻止默认事件，允许拖放
  const handleDragOver = e => {
    e.preventDefault();
  };

  // 处理角色从用户详情区移除（例如拖动到删除区域）
  const handleRoleDragStart = (e, roleId) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ type: 'role', id: roleId }));
  };

  return (
    <div
      className={styles.userDetails}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <h4>{user.name}'s Details</h4>

      {/* 使用 Ant Design Tree 组件展示树形结构 */}
      <Tree
        treeData={treeData}
        draggable
        onDragStart={(e, node) => handleRoleDragStart(e, node.key.split('-')[1])}
        onDrop={handleDrop}
      />

      {/* 删除区域的实现 - 可拖拽角色移除 */}
      <div
        className={styles.dropTarget}
        onDrop={e => {
          const data = JSON.parse(e.dataTransfer.getData('application/json'));
          if (data.type === 'role') {
            onRemoveRole(user.id, data.id); // 移除角色
          }
        }}
        onDragOver={e => e.preventDefault()}
      >
        🗑️ 拖拽角色至此移除
      </div>

      {/* <div className={styles.userInfo}>
        <div className={styles.rolesSection}>
          <h5>Role</h5>
          <ul>
            {userRoles.map(role => (
              <li
                key={role.id}
                draggable="true"
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', role.id);
                }}
              >
                {role.name}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.permissionsSection}>
          <h5>Permssion</h5>
          <ul>
            {userPermissions.map(permission => (
              <li key={permission.id}>{permission.name}</li>
            ))}
          </ul>
        </div>
      </div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const roleId = e.dataTransfer.getData('text/plain');
          if (onDropRole) {
            // 确保传递当前用户的 selectedUserId
            onDropRole(user.id, roleId); // 原代码中未使用 user.id
          }
        }}
        className={styles.dropTarget} // 添加可视样式
      >
        添加角色
      </div> */}
    </div>
  );
};

UserDetails.propTypes = {
  user: PropTypes.object,  // 用户信息
  roles: PropTypes.array.isRequired,  // 所有角色
  permissions: PropTypes.array.isRequired,  // 所有权限
  onRemoveRole: PropTypes.func.isRequired,  // 移除角色函数
  onDropRole: PropTypes.func.isRequired,  // 赋予角色函数
};

export default UserDetails;