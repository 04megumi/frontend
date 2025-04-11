import React, { useState } from 'react';
import UserList from './UserList';
import UserDetails from './UserDetails';
import RoleList from './RoleList';
import RoleDetails from './RoleDetails';
import PermissionList from './PermissionList';
import styles from '../../../css/dashboard/Dashboard.module.css';


const RBACManagement = (
  {
    layoutMode,
    toggleLayoutMode,
    showDeleteZone,
    setShowDeleteZone,
    users,
    roles,
    permissions,
    selectedUserId,
    setSelectedUserId,
    selectedRoleId,
    setSelectedRoleId,
    handleRemoveRoleFromUser,
    handleDropRoleOnUser,
    handleRemovePermissionFromRole,
    handleDropPermissionOnRole,
  }
) => {

  // 根据选中角色判断是否为超管角色（假设超管角色名称为 "超管"）
  const selectedRole = roles.find(role => role.id === selectedRoleId);
  const isSuperAdmin = selectedRole && selectedRole.name === '超管';

  return (
    <div className={styles.contentTab}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>RBAC 管理</h2>
        <div>
          <button className={styles.layoutButton} onClick={toggleLayoutMode}>
            Layout
          </button>
          <button className={styles.binButton} onClick={() => setShowDeleteZone(!showDeleteZone)}>
            {showDeleteZone ? 'Bin Off' : 'Bin on'}
          </button>
        </div>
      </div>
      {layoutMode ? (
        // 页面1：用户列表、用户详情、角色列表
        <div className={styles.columnsContainer}>
          <div className={styles.column}>
            <UserList users={users} onSelectUser={setSelectedUserId} />
          </div>
          <div className={styles.column}>
            <UserDetails
              user={users.find(user => user.id === selectedUserId)}
              roles={roles}
              permissions={permissions}
              onRemoveRole={handleRemoveRoleFromUser}
              onDropRole={handleDropRoleOnUser}
            />
          </div>
          <div className={styles.column}>
            <RoleList roles={roles} onDropRole={handleDropRoleOnUser} selectedUserId={selectedUserId} isDraggable={true} />
          </div>
        </div>
      ) : (
        // 页面2：角色列表、角色详情、权限列表
        <div className={styles.columnsContainer}>
          <div className={styles.column}>
            <RoleList
              roles={roles}
              onSelectRole={setSelectedRoleId}
              isDraggable={false}
              selectedRoleId={selectedRoleId} // 传递当前选中角色ID
            />
          </div>
          <div className={styles.column}>
            <RoleDetails
              role={selectedRole}
              permissions={permissions}
              // 如果是超管角色，则不允许删除或拖拽修改权限
              onRemovePermission={!isSuperAdmin ? handleRemovePermissionFromRole : undefined}
              onDropPermission={!isSuperAdmin ? handleDropPermissionOnRole : undefined}
              readOnly={isSuperAdmin}
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
          onDrop={(e) => {
            e.preventDefault();
            const data = e.dataTransfer.getData('text/plain');
            if (layoutMode) {
              handleRemoveRoleFromUser(data);
            } else {
              handleRemovePermissionFromRole(data);
            }
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          Trash Bin
        </div>
      )}
    </div>
  );

};

export default RBACManagement;