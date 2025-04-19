import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import UserList from './UserList.jsx';
import RoleList from './RoleList.jsx';
import PermissionList from './PermissionList.jsx';
import UserDetails from './UserDetails.jsx';
import RoleDetails from './RoleDetails.jsx';
import AddUserModal from './modals/AddUserModal.jsx';
import AddRoleModal from './modals/AddRoleModal.jsx';
import AddPermissionModal from './modals/AddPermissionModal.jsx';
import useRBACManagement from '../../../hooks/useRBACManagement';
import styles from '../../../css/dashboard/rbac/RBACManagement.module.css';

const RBACManagement = ({
  onPermissionAssign,
  onPermissionRemove,
  onShowUserModal,
  onShowRoleModal,
  onShowPermissionModal,
  onUserContextMenu
}) => {
  const { users, roles, permissions, addUserRole, removeUserRole, dropUserRole } = useRBACManagement();
  const [layoutMode, setLayoutMode] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showDeleteZone, setShowDeleteZone] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showAddPermissionModal, setShowAddPermissionModal] = useState(false);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (selectedUser) {
      const fresh = users.find(u => u.id === selectedUser.id);
      if (fresh && fresh !== selectedUser) {
        setSelectedUser(fresh);
        setVersion(v => v + 1);
      }
    }
    const toggleLayout = () => setLayoutMode(prev => !prev);
    const toggleDelete = () => setShowDeleteZone(prev => !prev);
    window.addEventListener('toggleLayout', toggleLayout);
    window.addEventListener('toggleDeleteZone', toggleDelete);
    return () => {
      window.removeEventListener('toggleLayout', toggleLayout);
      window.removeEventListener('toggleDeleteZone', toggleDelete);
    };
  }, [users, selectedUser]);

  return (
    <div className={styles.rbacContainer}>
      <div className={styles.actions}>
        <button className={styles.actionButton} onClick={() => setShowAddUserModal(true)}>+ 用户</button>
        <button className={styles.actionButton} onClick={() => setShowAddRoleModal(true)}>+ 角色</button>
        <button className={styles.actionButton} onClick={() => setShowAddPermissionModal(true)}>+ 权限</button>
      </div>

      {layoutMode ? (
        <div className={styles.layout}>
          <div className={styles.column}>
            <UserList users={users} onSelectUser={setSelectedUser} onContextMenu={onUserContextMenu} />
          </div>
          <div className={styles.column}>
            <UserDetails
              user={users.find(u => u.id === selectedUser?.id)}
              roles={roles}
              permissions={permissions}
              onDropRole={dropUserRole}
              onRemoveRole={removeUserRole}
              key={`${selectedUser?.id}-${version}`}
            />
          </div>
          <div className={styles.column}>
            <RoleList
              roles={roles}
              isDraggable
              selectedUserId={selectedUser?.id}
              onDropRole={roleId => selectedUser && addUserRole(selectedUser.id, roleId)}
              onSelectRole={() => {}}
              onContextMenu={onUserContextMenu}
            />
          </div>
        </div>
      ) : (
        <div className={styles.layout}>
          <div className={styles.column}>
            <RoleList roles={roles} onSelectRole={setSelectedRole} onContextMenu={onUserContextMenu} />
          </div>
          <div className={styles.column}>
            <RoleDetails
              role={selectedRole}
              permissions={permissions}
              onAssignPermission={onPermissionAssign}
              onRemovePermission={onPermissionRemove}
            />
          </div>
          <div className={styles.column}>
            <PermissionList permissions={permissions} onContextMenu={onUserContextMenu} />
          </div>
        </div>
      )}

      {showDeleteZone && (
        <div
          className={styles.deleteZone}
          onDrop={e => {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            if (data.type === 'role') {
              removeUserRole(data.userId, data.id || data.roleId);
            } else if (data.type === 'permission') {
              onPermissionRemove(data.id);
            }
          }}
          onDragOver={e => e.preventDefault()}
        >
          🗑️ 拖拽至此删除
        </div>
      )}

      {showAddUserModal && <AddUserModal onClose={() => setShowAddUserModal(false)} onAddUser={onShowUserModal} />}
      {showAddRoleModal && <AddRoleModal onClose={() => setShowAddRoleModal(false)} onAddRole={onShowRoleModal} />}
      {showAddPermissionModal && <AddPermissionModal onClose={() => setShowAddPermissionModal(false)} onAddPermission={onShowPermissionModal} />}
    </div>
  );
};

RBACManagement.propTypes = {
  onPermissionAssign: PropTypes.func.isRequired,
  onPermissionRemove: PropTypes.func.isRequired,
  onShowUserModal: PropTypes.func.isRequired,
  onShowRoleModal: PropTypes.func.isRequired,
  onShowPermissionModal: PropTypes.func.isRequired,
  onUserContextMenu: PropTypes.func.isRequired
};

export default RBACManagement;