import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ContextMenu from '../contextMenu/ContextMenu.jsx';
import styles from '../../../css/dashboard/rbac/UserList.module.css';

const UserList = ({
  users,
  onSelectUser,
  onContextMenu
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContextMenu = (event, user) => {
    event.preventDefault(); // 阻止默认的右键菜单
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setSelectedUser(user); // 设置选中的用户
    setShowContextMenu(true);
  };

  const handleCloseContextMenu = () => {
    setShowContextMenu(false);
  };

  const handleContextMenuAction = (action) => {
    onContextMenu(action, selectedUser);
  };

  return (
    <div className={styles.userListContainer}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="搜索用户..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.userList} style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <h4>Users</h4>
        <div className={styles.users}>
          {filteredUsers.map(user => (
            <div
              key={user.id}
              className={styles.user}
              onClick={() => onSelectUser && onSelectUser(user)}
              onContextMenu={(event) => handleContextMenu(event, user)}
            >
              {user.name}
            </div>
          ))}
        </div>
      </div>

      {/* 渲染 ContextMenu */}
      {showContextMenu && (
        <ContextMenu
          onClose={handleCloseContextMenu}
          onContextMenu={handleContextMenuAction}
          contextMenuPosition={contextMenuPosition} // 传递 contextMenuPosition
        />
      )}
    </div>
  );
};

UserList.propTypes = {
  users: PropTypes.array.isRequired,
  onSelectUser: PropTypes.func,
  onContextMenu: PropTypes.func.isRequired,
};

export default UserList;