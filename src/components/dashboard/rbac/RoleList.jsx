import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../../../css/dashboard/rbac/RoleList.module.css';

const RoleList = ({
  roles,
  onDragStart,
  onSelectRole,
  onDropRole,
  selectedUserId,
  isDraggable,
  onAddUser,
  isLayoutMode,
  onShowRoleModal,
  onContextMenu
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 拖拽开始时的回调
  const handleDragStart = (e, role) => {
    // 设置拖拽数据：在拖拽时需要传递数据
    e.dataTransfer.setData('roleId', role.id);
    if (onDragStart) onDragStart(role);  // 可选择传递额外的回调
  };

  const handleRightClick = (e, roleId) => {
    e.preventDefault(); // 防止默认的右键菜单显示
    if (onContextMenu) {
      onContextMenu(roleId); // 调用右键菜单的回调
    }
  };

  return (
    <div className={styles.roleListContainer} style={{ maxHeight: '600px', overflowY: 'auto' }}>
      {/* 搜索框 */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="搜索角色..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />

      {/* 角色列表 */}
      </div>
      <div className={styles.roleList} style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <h4>Roles</h4>
        <div className={styles.roles}>
          {filteredRoles.map(role => (
            <div
              key={role.id}
              className={styles.role}
              draggable={isDraggable}
              onDragStart={(e) => handleDragStart(e, role)}  // 在拖拽开始时设置数据
              onClick={() => onSelectRole && onSelectRole(role.id)}
              onContextMenu={(e) => handleRightClick(e, role.id)}
            >
              {role.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

RoleList.propTypes = {
  roles: PropTypes.array.isRequired,  // 角色数组
  onDragStart: PropTypes.func,  // 拖拽开始时的回调
  onSelectRole: PropTypes.func,  // 选中角色时的回调
  onDropRole: PropTypes.func,  // 拖拽角色放下时的回调
  isDraggable: PropTypes.bool.isRequired,  // 是否允许拖拽
  onAddUser: PropTypes.func.isRequired,  // 添加用户的回调
  onShowRoleModal: PropTypes.func.isRequired,  // 显示角色模态框的回调
  onContextMenu: PropTypes.func.isRequired,  // 右键菜单的回调
};

export default RoleList;