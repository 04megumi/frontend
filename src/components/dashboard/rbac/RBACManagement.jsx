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
import EditUserModal from './modals/AddUserModal.jsx';
import EditRoleModal from './modals/AddRoleModal.jsx';
import EditPermissionModal from './modals/AddPermissionModal.jsx';
import useRBACManagement from '../../../hooks/useRBACManagement';
import styles from '../../../css/dashboard/rbac/RBACManagement.module.css';

const RBACManagement = ({
  onShowUserModal,
  onShowRoleModal,
  onShowPermissionModal,
  onUserContextMenu,
}) => {
  const {
    users,
    roles,
    permissions,
    userNames,
    roleIds,
    permissionIds,
    setuserNames,
    setRoleIds,
    setPermissionIds,
    addUserRole,
    removeUserRole,
    dropUserRole,
    addRolePermission,
    removeRolePermission,
    dropRolePermission,
  } = useRBACManagement();

  const [layoutMode, setLayoutMode] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showAddPermissionModal, setShowAddPermissionModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [showEditPermissionModal, setShowEditPermissionModal] = useState(false);

  useEffect(() => {
    const togLayout = () => setLayoutMode((prev) => !prev);
    window.addEventListener('toggleLayout', togLayout);
    return () => {
      window.removeEventListener('toggleLayout', togLayout);
    };
  }, [users, selectedUser]);

  return (
    <main className={styles.rbacContainer}>
      {/* 操作按钮区域 */}
      <section className={styles.actions}>
        <button className={styles.actionButton} onClick={() => setShowAddUserModal(true)}>
          + 用户
        </button>
        <button className={styles.actionButton} onClick={() => setShowAddRoleModal(true)}>
          + 角色
        </button>
        <button className={styles.actionButton} onClick={() => setShowAddPermissionModal(true)}>
          + 权限
        </button>
      </section>

      {/* 主内容区域 */}
      <section className={styles.contentArea}>
        {layoutMode ? (
          // 用户-角色布局模式
          <div className={styles.layout}>
            <div className={styles.column}>
              <UserList
                userNames={userNames}
                onSelectUser={setSelectedUser}
                onContextMenu={onUserContextMenu}
              />
            </div>
            <div className={styles.column}>
              <UserDetails
                userName={selectedUser}
                onAddRole={(roleId) => {
                  console.log('添加权限:', roleId); // 调试日志
                  dropUserRole(selectedUser, { type: 'role', id: roleId });
                }}
                onRemoveRole={(roleId) => {
                  console.log('删除权限:', roleId); // 调试日志
                  removeUserRole(selectedUser, userId);
                }}
              />
            </div>
            <div className={styles.column}>
              <RoleList
                roleIds={roleIds}
                isDraggable
                onDropRole={(rid) => selectedUser && addUserRole(selectedUser.id, rid)}
                onSelectRole={() => {}}
                onContextMenu={onUserContextMenu}
              />
            </div>
          </div>
        ) : (
          // 角色-权限布局模式
          <div className={styles.layout}>
            <div className={styles.column}>
              <RoleList
                roleIds={roleIds}
                onSelectRole={setSelectedRole}
                onContextMenu={onUserContextMenu}
              />
            </div>
            <div className={styles.column}>
              <RoleDetails
                roleId={selectedRole}
                onAddPermission={(permissionId) => {
                  console.log('添加权限:', permissionId); // 调试日志
                  dropRolePermission(selectedRole, {
                    type: 'permission',
                    id: permissionId,
                  });
                }}
                onRemovePermission={(permissionId) => {
                  console.log('删除权限:', permissionId); // 调试日志
                  removeRolePermission(selectedRole, permissionId);
                }}
              />
            </div>
            <div className={styles.column}>
              <PermissionList
                permissionIds={permissionIds}
                isDraggable
                onSelectPermission={() => {}}
                onContextMenu={onUserContextMenu}
              />
            </div>
          </div>
        )}
      </section>

      {/* 添加框 */}
      <section className={styles.modalArea}>
        {showAddUserModal && (
          <AddUserModal
            onClose={() => setShowAddUserModal(false)}
            onAddUser={onShowUserModal}
            onSuccess={(newUsername) => {
              setuserNames([...userNames, newUsername]);
            }}
          />
        )}
        {showAddRoleModal && (
          <AddRoleModal
            onClose={() => setShowAddRoleModal(false)}
            onAddRole={onShowRoleModal}
            onSuccess={(newRoleId) => {
              setRoleIds([...roleIds, newRoleId]);
            }}
          />
        )}
        {showAddPermissionModal && (
          <AddPermissionModal
            onClose={() => setShowAddPermissionModal(false)}
            onAddPermission={onShowPermissionModal}
            onSuccess={(newPermissionId) => {
              setPermissionIds([...permissionIds, newPermissionId]);
            }}
          />
        )}
      </section>

      {/* 编辑框 */}
      <section className={styles.modalArea}>
        {showEditUserModal && (
          <EditUserModal
            onClose={() => setShowEditUserModal(false)}
            onEditUser={onShowEditUserModal}
          />
        )}
        {showEditRoleModal && (
          <EditRoleModal
            onClose={() => setShowEditRoleModal(false)}
            onEditRole={onShowEditRoleModal}
          />
        )}
        {showEditPermissionModal && (
          <EditPermissionModal
            onClose={() => setShowEditPermissionModal(false)}
            onEditPermission={onShowEditPermissionModal}
          />
        )}
      </section>
    </main>
  );
};

RBACManagement.propTypes = {
  onShowUserModal: PropTypes.func.isRequired,
  onShowRoleModal: PropTypes.func.isRequired,
  onShowPermissionModal: PropTypes.func.isRequired,
  onUserContextMenu: PropTypes.func.isRequired,
};

export default RBACManagement;
