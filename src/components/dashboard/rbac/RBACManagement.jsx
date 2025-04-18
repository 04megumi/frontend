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
  users,
  roles,
  permissions,
  onRoleAssign,
  onPermissionAssign,
  onRoleRemove,
  onPermissionRemove,
  onShowUserModal,
  onShowRoleModal,
  onShowPermissionModal,
  onUserContextMenu,
}) => {
  const [layoutMode, setLayoutMode] = useState(true); // true: 用户视图；false: 角色视图
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showDeleteZone, setShowDeleteZone] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showAddPermissionModal, setShowAddPermissionModal] = useState(false);

  const handleLayoutToggle = () => setLayoutMode(!layoutMode);

  useEffect(() => {
    const toggleLayoutHandler = () => setLayoutMode(prev => !prev);
    const toggleDeleteZoneHandler = () => setShowDeleteZone(prev => !prev);

    window.addEventListener('toggleLayout', toggleLayoutHandler);
    window.addEventListener('toggleDeleteZone', toggleDeleteZoneHandler);

    return () => {
      window.removeEventListener('toggleLayout', toggleLayoutHandler);
      window.removeEventListener('toggleDeleteZone', toggleDeleteZoneHandler);
    };
  }, []);

  return (
    <div className={styles.rbacContainer}>
      <div className={styles.actions}>
        <button
          className={styles.actionButton}
          onClick={() => setShowAddUserModal(true)}
        >
          + 用户
        </button>
        <button
          className={styles.actionButton}
          onClick={() => setShowAddRoleModal(true)}
        >
          + 角色
        </button>
        <button
          className={styles.actionButton}
          onClick={() => setShowAddPermissionModal(true)}
        >
          + 权限
        </button>
      </div>

      {layoutMode ? (
        <div className={styles.layout}>
          <div className={styles.column}>
            <UserList
              users={users}
              onSelectUser={setSelectedUser}
              onContextMenu={onUserContextMenu}
            />
          </div>
          <div className={styles.column}>
            <UserDetails
              user={selectedUser}
              roles={roles}
              permissions={permissions}
              onDropRole={(userId, roleId) => onRoleAssign(userId, roleId)}
              onRemoveRole={(userId, roleId) => onRoleRemove(userId, roleId)}
            />
          </div>
          <div className={styles.column}>
            <RoleList
              roles={roles}
              onDrop={roleId => {
                if (selectedUser) {
                  onRoleAssign(selectedUser.id, roleId);
                }
              }}
              onSelectRole={() => { }}
              isDraggable={true}
              onContextMenu={onUserContextMenu}
            />
          </div>
        </div>
      ) : (
        <div className={styles.layout}>
          <div className={styles.column}>
            <RoleList
              roles={roles}
              onSelect={setSelectedRole}
              onContextMenu={onUserContextMenu}
            />
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
            <PermissionList permissions={permissions} 
            onContextMenu={onUserContextMenu}
            />
          </div>
        </div>
      )}

      {showDeleteZone && (
        <div
          className={styles.deleteZone}
          onDrop={e => {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            if (data.type === 'role') {
              onRoleRemove(data.id);
            } else if (data.type === 'permission') {
              onPermissionRemove(data.id);
            }
          }}
          onDragOver={e => e.preventDefault()}
        >
          🗑️ 拖拽至此删除
        </div>
      )}

      {/* 渲染 AddUserModal */}
      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          onAddUser={onShowUserModal}
        />
      )}

      {/* 渲染 AddRoleModal */}
      {showAddRoleModal && (
        <AddRoleModal
          onClose={() => setShowAddRoleModal(false)}
          onAddRole={onShowRoleModal}
        />
      )}

      {/* 渲染 AddPermissionModal */}
      {showAddPermissionModal && (
        <AddPermissionModal
          onClose={() => setShowAddPermissionModal(false)}
          onAddPermission={onShowPermissionModal}
        />
      )}
    </div>
  );
};

RBACManagement.propTypes = {
  users: PropTypes.array.isRequired,
  roles: PropTypes.array.isRequired,
  permissions: PropTypes.array.isRequired,
  onRoleAssign: PropTypes.func.isRequired,
  onPermissionAssign: PropTypes.func.isRequired,
  onRoleRemove: PropTypes.func.isRequired,
  onPermissionRemove: PropTypes.func.isRequired,
  onShowUserModal: PropTypes.func.isRequired,
  onShowRoleModal: PropTypes.func.isRequired,
  onShowPermissionModal: PropTypes.func.isRequired,
  onUserContextMenu: PropTypes.func.isRequired,
};

export default RBACManagement;
