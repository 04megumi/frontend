import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ContextMenu from '../contextMenu/ContextMenu.jsx';
import styles from '../../../css/dashboard/rbac/PermissionList.module.css';

const PermissionList = ({
  permissions,
  onSelectPermission,
  onContextMenu,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);

  const filteredPermissions = permissions.filter(permission =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContextMenu = (event, Permission) => {
    event.preventDefault();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setSelectedPermission(Permission);
    setShowContextMenu(true);
  };

  const handleCloseContextMenu = () => {
    setShowContextMenu(false);
  };

  const handleContextMenuAction = (action) => {
    onContextMenu(action, selectedPermission);
  };

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
      </div>
      <div className={styles.permissionList} style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <h4>Permissions</h4>
        <div className={styles.permissions}>
          {filteredPermissions.map(permission => (
            <div
              key={permission.id}
              className={styles.permission}
              onClick={() => onSelectPermission && onSelectPermission(permission)}
              draggable="true"
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', permission.id);
              }}
              onContextMenu={(event) => handleContextMenu(event, permission)}
            >
              {permission.name}
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

export default PermissionList;