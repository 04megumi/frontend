import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ContextMenu from '../contextMenu/ContextMenu.jsx';
import styles from '../../../css/dashboard/rbac/UserList.module.css';

const UserList = ({ userNames, onSelectUser, onContextMenu }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = userNames.filter((user) =>
    user.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleContextMenu = (event, user) => {
    event.preventDefault();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setSelectedUser(user);
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
          {filteredUsers.map((user) => (
            <div
              key={user}
              className={styles.user}
              onClick={() => onSelectUser && onSelectUser(user)}
              onContextMenu={(event) => handleContextMenu(event, user)}
            >
              {user}
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
  userNames: PropTypes.array.isRequired,
  onSelectUser: PropTypes.func,
  onContextMenu: PropTypes.func.isRequired,
};

export default UserList;
