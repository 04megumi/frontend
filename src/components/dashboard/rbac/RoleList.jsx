import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useDragDrop from '../../../hooks/useDragDrop';
import styles from '../../../css/dashboard/rbac/RoleList.module.css';

const RoleList = ({
  roles,
  onDragStart,
  onSelectRole,
  onDropRole,
  selectedUserId, // ✅ 补上注释
  isDraggable,
  onAddUser,
  isLayoutMode,
  onShowRoleModal,
  onContextMenu
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { handleDragStart } = useDragDrop(); // ✅ 只需 handleDragStart

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 统一封装角色拖拽开始事件
  const handleRoleDragStart = (e, role) => {
    const data = { type: 'role', roleId: role.id };
    console.log('拖拽数据:', JSON.stringify(data)); // 调试日志
    handleDragStart(e, data); // ✅ 使用封装 hook
    if (onDragStart) {
      onDragStart(role); // ✅ 回调父组件
    }
    console.log('RoleList 拖拽开始，数据：', role.id);
  };

  const handleRoleRightClick = (e, roleId) => {
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
      </div>

      {/* 角色列表 */}
      <div className={styles.roleList} style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <h4>Roles</h4>
        <div className={styles.roles}>
          {filteredRoles.map(role => (
            <div
              key={role.id}
              className={styles.role}
              draggable={isDraggable}
              onDragStart={(e) => handleRoleDragStart(e, role)} // ✅ 使用封装逻辑
              onClick={() => onSelectRole && onSelectRole(role.id)}
              onContextMenu={(e) => handleRoleRightClick(e, role.id)}
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
  selectedUserId: PropTypes.string, // 当前选中的用户ID
  isLayoutMode: PropTypes.bool // 是否处于布局模式
};

export default RoleList;
