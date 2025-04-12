import React, { useState } from 'react';
import PropTypes from 'prop-types';
import UserList from './UserList.jsx';
import RoleList from './RoleList.jsx';
import PermissionList from './PermissionList.jsx';
import UserDetails from './UserDetails.jsx';
import RoleDetails from './RoleDetails.jsx';
import styles from '../../../css/dashboard/rbac/RBACManagement.module.css';

const RBACManagement = ({
  users,
  roles,
  permissions,
  onRoleAssign,
  onPermissionAssign,
  onRoleRemove,
  onPermissionRemove
}) => {
  const [layoutMode, setLayoutMode] = useState(true); // true: 用户视图；false: 角色视图
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showDeleteZone, setShowDeleteZone] = useState(false);

  const handleLayoutToggle = () => setLayoutMode(!layoutMode);

  return (
    <div className={styles.rbacContainer}>
      <div className={styles.controls}>
        <button 
          className={styles.controlButton}
          onClick={handleLayoutToggle}
        >
          {layoutMode ? '切换到角色视图' : '切换到用户视图'}
        </button>
        <button
          className={styles.controlButton}
          onClick={() => setShowDeleteZone(!showDeleteZone)}
        >
          {showDeleteZone ? '隐藏删除区' : '显示删除区'}
        </button>
      </div>

      {layoutMode ? (
        <div className={styles.layout}>
          <div className={styles.column}>
            <UserList 
              users={users}
              onSelect={setSelectedUser}
            />
          </div>
          <div className={styles.column}>
            <UserDetails
              user={selectedUser}
              roles={roles}
              onAssignRole={onRoleAssign}
              onRemoveRole={onRoleRemove}
            />
          </div>
          <div className={styles.column}>
            <RoleList
              roles={roles}
              onDrop={roleId => onRoleAssign(selectedUser?.id, roleId)}
            />
          </div>
        </div>
      ) : (
        <div className={styles.layout}>
          <div className={styles.column}>
            <RoleList
              roles={roles}
              onSelect={setSelectedRole}
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
            <PermissionList permissions={permissions} />
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
  onPermissionRemove: PropTypes.func.isRequired
};

export default RBACManagement;