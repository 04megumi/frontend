import React, { useState } from 'react';
import styles from '../../../css/dashboard/rbac/PermissionList.module.css';

const PermissionList = ({ permissions, onShowPermissionModal, onContextMenu }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPermissions = permissions.filter(permission =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.permissionListContainer}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="搜索权限..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        {/* <button onClick={onShowPermissionModal} className="text-blue-600 hover:text-blue-800">
          <i className="fas fa-plus"></i>
        </button> */}
      </div>
      <div className={styles.permissionList} style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <h4>Permissions</h4>
        <div className={styles.permissions}>
          {filteredPermissions.map(permission => (
            <div
              key={permission.id}
              className={styles.permission}
              draggable="true" // 始终允许拖动权限
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', permission.id);
              }}

            >
              {permission.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PermissionList;