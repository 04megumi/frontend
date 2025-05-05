import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ContextMenu from '../contextMenu/ContextMenu.jsx';
import EditRoleModal from './modals/EditRoleModal.jsx';
import useDragDrop from '../../../hooks/useDragDrop.js';
import styles from '../../../css/dashboard/rbac/RoleList.module.css';

const RoleList = ({ roleIds, setRoleIds, isDraggable, onSelectRole, onContextMenu }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const { handleDragStart } = useDragDrop();

  const filteredRoles = roleIds.filter((role) =>
    role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleContextMenu = (event, role) => {
    event.preventDefault();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setSelectedRole(role);
    setShowContextMenu(true);
  };

  const handleCloseContextMenu = () => setShowContextMenu(false);

  const handleEditSuccess = () => {
    setShowEditModal(false);
    onContextMenu('refresh');
  };

  const handleContextMenuAction = (action, actionType) => {
    onContextMenu(action, selectedRole);
    if (actionType === 'edit') {
      setShowEditModal(true);
    }
  };

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
      </div>

      <div className={styles.roleList} style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <h4>Roles</h4>
        <div className={styles.roles}>
          {filteredRoles.map((role) => (
            <div
              key={role}
              className={styles.role}
              draggable={isDraggable}
              onDragStart={(e) => {
                e.stopPropagation();
                handleDragStart(e, {
                  type: 'roleId',
                  id: role,
                  timestamp: Date.now(),
                  signature: Math.random().toString(36).slice(2),
                });
              }}
              onClick={() => onSelectRole && onSelectRole(role)}
              onContextMenu={(e) => handleContextMenu(e, role)}
              data-testid={`role-item-${role}`}
            >
              <span className={styles.roleName}>{role}</span>
            </div>
          ))}
        </div>
      </div>
      {showContextMenu && (
        <ContextMenu
          roleId={selectedRole}
          roleIds={roleIds}
          setRoleIds={setRoleIds}
          which={"role"}
          onClose={handleCloseContextMenu}
          onContextMenu={handleContextMenuAction}
          contextMenuPosition={contextMenuPosition}
          onEditClick={() => {
            setShowEditModal(true);
            onContextMenu('edit', selectedRole);
          }}
        />
      )}
      {showEditModal && (
        <EditRoleModal
          roleId={selectedRole}
          onClose={() => setShowEditModal(false)}
          onEditSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

RoleList.propTypes = {
  roleIds: PropTypes.array.isRequired,
  isDraggable: PropTypes.bool,
  onSelectRole: PropTypes.func,
  onDropRole: PropTypes.func,
  selectedUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onContextMenu: PropTypes.func,
  onEditClick: PropTypes.func.isRequired,
};

RoleList.defaultProps = {
  isDraggable: false,
  onSelectRole: null,
  onDropRole: null,
  selectedUserId: null,
  onContextMenu: () => { },
};

export default RoleList;
