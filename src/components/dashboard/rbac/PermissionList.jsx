import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ContextMenu from '../contextMenu/ContextMenu.jsx';
import EditPermissionModal from './modals/EditPermissionModal.jsx'
import useDragDrop from '../../../hooks/useDragDrop';
import styles from '../../../css/dashboard/rbac/PermissionList.module.css';

const PermissionList = ({ permissionIds, setPermissionIds, isDraggable, onSelectPermission, onContextMenu }) => {
  const [term, setTerm] = useState('');
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const { handleDragStart } = useDragDrop();

  const filtered = permissionIds.filter((p) => p.toLowerCase().includes(term.toLowerCase()));
  const handleContextMenu = (e, p) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setSelectedPermission(p);
    setShowContextMenu(true);
  };

  const handleCloseContextMenu = () => {
    setShowContextMenu(false);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    onContextMenu('refresh');
  };

  const handleContextMenuAction = (action, actionType) => {
    onContextMenu(action, selectedPermission);
    if (actionType === 'edit') {
      setShowEditModal(true);
    }
  };

  return (
    <div
      className={styles.permissionListContainer}
      style={{ maxHeight: '600px', overflowY: 'auto' }}
    >
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="搜索权限..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.permissionList} style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <h4>Permissions</h4>
        <div className={styles.permissions}>
          {filtered.map((p) => (
            <div
              key={p}
              className={styles.permission}
              draggable={isDraggable}
              onDragStart={(e) => {
                e.stopPropagation();
                handleDragStart(e, {
                  type: 'permission',
                  id: p,
                  timestamp: Date.now(),
                  signature: Math.random().toString(36).slice(2),
                });
              }}
              onClick={() => onSelectPermission && onSelectPermission(p)}
              onContextMenu={(e) => handleContextMenu(e, p)}
              data-testid={`perm-item-${p}`}
            >
              {p}
            </div>
          ))}
        </div>
      </div>
      {showContextMenu && (
        <ContextMenu
          permissionId={selectedPermission}
          permissionIds={permissionIds}
          setPermissionIds={setPermissionIds}
          which="permission"
          onClose={() => setShowContextMenu(false)}
          onContextMenu={(action) => onContextMenu(action, selectedPermission)}
          contextMenuPosition={contextMenuPosition}
          onEditClick={() => {
            setShowEditModal(true);
            onContextMenu('edit', selectedPermission);
          }}
        />
      )}
      {showEditModal && (
        <EditPermissionModal
          permissionId={selectedPermission}
          onClose={() => setShowEditModal(false)}
          onEditSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

PermissionList.propTypes = {
  permissionIds: PropTypes.array.isRequired,
  isDraggable: PropTypes.bool,
  onSelectPermission: PropTypes.func,
  onContextMenu: PropTypes.func,
  onEditClick: PropTypes.func.isRequired,
};

PermissionList.defaultProps = {
  isDraggable: false,
  onSelectPermission: null,
  onContextMenu: () => { },
};

export default PermissionList;
