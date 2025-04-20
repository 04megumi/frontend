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

const RBACManagement = ({ onShowUserModal, onShowRoleModal, onShowPermissionModal, onUserContextMenu }) => {
  const {
    users, roles, permissions,
    addUserRole, removeUserRole, dropUserRole,
    addRolePermission, removeRolePermission, dropRolePermission
  } = useRBACManagement();

  const [layoutMode, setLayoutMode] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showDeleteZone, setShowDeleteZone] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showAddPermissionModal, setShowAddPermissionModal] = useState(false);

  useEffect(() => {
    const togLayout = () => setLayoutMode(prev => !prev);
    const togDelete = () => setShowDeleteZone(prev => !prev);
    window.addEventListener('toggleLayout', togLayout);
    window.addEventListener('toggleDeleteZone', togDelete);
    return () => {
      window.removeEventListener('toggleLayout', togLayout);
      window.removeEventListener('toggleDeleteZone', togDelete);
    };
  }, [users, selectedUser]);

  return (
    <main className={styles.rbacContainer}>
      {/* 操作按钮区域 */}
      <section className={styles.actions}>
        <button className={styles.actionButton} onClick={() => setShowAddUserModal(true)}>+ 用户</button>
        <button className={styles.actionButton} onClick={() => setShowAddRoleModal(true)}>+ 角色</button>
        <button className={styles.actionButton} onClick={() => setShowAddPermissionModal(true)}>+ 权限</button>
      </section>

      {/* 主内容区域 */}
      <section className={styles.contentArea}>
        {layoutMode ? (
          // 用户-角色布局模式
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
              />
            </div>
            <div className={styles.column}>
              <RoleList
                roles={roles}
                isDraggable
                onDropRole={rid => selectedUser && addUserRole(selectedUser.id, rid)}
                onSelectRole={() => {}}
                onContextMenu={onUserContextMenu}
              />
            </div>
          </div>
        ) : (
          // 角色-权限布局模式
          <div className={styles.layout}>
            <div className={styles.column}>
              <RoleList roles={roles} onSelectRole={setSelectedRole} onContextMenu={onUserContextMenu} />
            </div>
            <div className={styles.column}>
              <RoleDetails
                role={roles.find(r => r.id === selectedRole?.id)}
                permissions={permissions}
                onDropPermission={dropRolePermission}
                onRemovePermission={removeRolePermission}
              />
            </div>
            <div className={styles.column}>
              <PermissionList
                permissions={permissions}
                isDraggable
                onSelectPermission={() => {}}
                onContextMenu={onUserContextMenu}
              />
            </div>
          </div>
        )}
      </section>

      {/* 删除区域 */}
      {showDeleteZone && (
        <section
          className={styles.deleteZone}
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            if (data.type === 'role') removeUserRole(data.userId, data.id || data.roleId);
            if (data.type === 'permission') onShowPermissionModal(data.id);
          }}
        >拖拽至此删除</section>
      )}
      
      {/* 添加框 */}
      <section className={styles.modalArea}>
        {showAddUserModal && <AddUserModal onClose={() => setShowAddUserModal(false)} onAddUser={onShowUserModal} />}
        {showAddRoleModal && <AddRoleModal onClose={() => setShowAddRoleModal(false)} onAddRole={onShowRoleModal} />}
        {showAddPermissionModal && <AddPermissionModal onClose={() => setShowAddPermissionModal(false)} onAddPermission={onShowPermissionModal} />}
      </section>
    </main>

  );
};

RBACManagement.propTypes = {
  onShowUserModal: PropTypes.func.isRequired,
  onShowRoleModal: PropTypes.func.isRequired,
  onShowPermissionModal: PropTypes.func.isRequired,
  onUserContextMenu: PropTypes.func.isRequired
};

export default RBACManagement;