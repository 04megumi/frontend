import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { DownOutlined } from '@ant-design/icons';
import { Tree } from 'antd';
import styles from '../../../css/dashboard/rbac/UserDetails.module.css';

/**
 * 拖拽逻辑：
 * - 当从 RoleList 拖入新的角色到该用户详情区域时，调用 onDropRole(userId, roleId)
 * - 当角色在 UserDetails 内拖拽结束时，如果拖放位置在 UserDetails 外部，则调用 onRemoveRole(userId, roleId)
 */
const UserDetails = ({ user, roles, permissions, onRemoveRole, onDropRole }) => {
  if (!user) {
    return <div className={styles.noUserSelected}>请选择一个用户</div>;
  }

  // 使用 ref 记录用户详情容器
  const containerRef = useRef(null);
  // 用于记录当前正在拖拽的角色ID
  const [draggedRoleId, setDraggedRoleId] = useState(null);
  // 确保是数组
  const userRoles = Array.isArray(user.roles) ? user.roles : [];  


  // 新的树形数据构造：
  // 对于用户拥有的每个角色，从 roles 数组中过滤出来，然后为每个角色构造一个节点，
  // 并在该角色节点下展示此角色拥有的权限。假设每个 role 对象包含一个 permissions 属性（角色权限ID数组）。
  // 构造角色子树
  const roleNodes = roles
    .filter(role => userRoles.includes(role.id)) // 获取该用户的角色
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
        draggable: true,  // 允许该角色节点拖拽
        // 使用 data 字段传递拖拽数据
        data: { type: 'role', roleId: role.id },
        children: permissionNodesForRole,
      };
    });

  // 构造树形数据：用户节点直接的 children 是多个角色节点
  const treeData = [
    {
      title: user.name,
      key: `user-${user.id}`,
      children: roleNodes,
    },
  ];

  // 自定义 titleRender：为角色节点绑定拖拽开始事件
  const titleRender = (nodeData) => {
    // 如果是角色节点，绑定 onDragStart
    if (nodeData.key.startsWith('role-')) {
      return (
        <div
          draggable
          onDragStart={(e) => {
            // 设置拖拽数据，记录开始拖拽的角色ID
            const roleId = nodeData.key.split('-')[1];
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

  // 拖拽事件：使用 Tree 组件的 onDrop 方法，注意 antd Tree 内部 event 对象在 info.event 中
  const handleTreeDrop = (info) => {
    // info.event 为原生事件
    try {
      const dataStr = info.event.dataTransfer.getData('application/json');
      const data = JSON.parse(dataStr);
      if (data && data.type === 'role') {
        // 调用外部传入的 onDropRole，将拖入的角色赋予用户
        onDropRole(user.id, data.roleId);
      }
    } catch (err) {
      console.error('Tree onDrop解析数据失败:', err);
    }
  };

  // 处理拖拽结束，在 UserDetails 内检测鼠标是否离开容器
  const handleDragEnd = (e) => {
    if (containerRef.current && draggedRoleId) {
      const rect = containerRef.current.getBoundingClientRect();
      // 如果鼠标结束位置不在用户详情容器内，则视为移除角色
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        onRemoveRole(user.id, draggedRoleId);
      }
      // 清除当前拖拽的角色ID
      setDraggedRoleId(null);
    }
  };

  return (
    <div className={styles.userDetails} onDragOver={(e) => e.preventDefault()}>
      <h4>{user.name}'s Details</h4>
      {/* 使用 Ant Design Tree 展示 */}
      <Tree
        treeData={treeData}
        draggable
        titleRender={titleRender}
        onDrop={handleTreeDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnd={handleDragEnd} // 当拖拽结束时检测是否拖出容器
      />
    </div>
  );
};


UserDetails.propTypes = {
  user: PropTypes.object,  // 用户信息
  roles: PropTypes.array.isRequired,  // 所有角色数组，每个角色包含 permissions 字段
  permissions: PropTypes.array.isRequired,  // 所有权限数组
  onRemoveRole: PropTypes.func.isRequired,  // 移除角色回调: (userId, roleId) => {}
  onDropRole: PropTypes.func.isRequired,  // 赋予角色回调: (userId, roleId) => {}
};

export default UserDetails;