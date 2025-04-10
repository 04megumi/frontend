import React, { useState } from 'react';
import styles from '../../../css/dashboard/rbac/RoleList.module.css';

const RoleList = ({ roles, onDropRole, selectedUserId, onSelectRole, isDraggable, onAddUser, isLayoutMode }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.roleListContainer} style={{ maxHeight: '600px', overflowY: 'auto' }}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="搜索角色..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <button
          className={styles.addButton}
          onClick={onAddUser}
        >
          +
        </button>
      </div>
      <h4>Roles</h4>
      <div className={styles.roles}>
        {filteredRoles.map(role => (
          <div
            key={role.id}
            className={styles.role}
            draggable={isDraggable} // 根据布局模式动态控制
            onDragStart={(e) => {
              if (isDraggable && onDropRole) {
                e.dataTransfer.setData('text/plain', role.id);
              }
            }}
            onClick={() => onSelectRole && onSelectRole(role.id)}
          >
            {role.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleList;