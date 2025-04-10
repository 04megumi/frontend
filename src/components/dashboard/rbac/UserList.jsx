import React, { useState } from 'react';
import styles from '../../../css/dashboard/rbac/UserList.module.css';

const UserList = ({ users, onSelectUser, onAddUser }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <button
          className={styles.addButton}
          onClick={onAddUser}
        >
          +
        </button>
      </div>
      <div className={styles.userList} style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <h4>Users</h4>
        <div className={styles.users}>
          {filteredUsers.map(user => (
            <div
              key={user.id}
              className={styles.user}
              onClick={() => onSelectUser && onSelectUser(user.id)}
            >
              {user.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserList;