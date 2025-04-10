import React from 'react';
import styles from '../../../css/dashboard/rbac/UserDetails.module.css';

const UserDetails = ({ user, roles, permissions, onRemoveRole, onDropRole }) => {
    if (!user) {
      return <div className={styles.noUserSelected}>请选择一个用户</div>;
    }
  
    const userRoles = roles.filter(role => user.roles.includes(role.id));
    const userPermissions = permissions.filter(permission => {
      return userRoles.some(role => role.permissions.includes(permission.id));
    });
  
    return (
      <div className={styles.userDetails}>
        <h4>{user.name}'s Details</h4>
        <div className={styles.userInfo}>
          <div className={styles.rolesSection}>
            <h5>Role</h5>
            <ul>
              {userRoles.map(role => (
                <li 
                    key={role.id} 
                    draggable="true" 
                    onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', role.id);
                      }}
                    >
                  {role.name}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.permissionsSection}>
            <h5>Permssion</h5>
            <ul>
              {userPermissions.map(permission => (
                <li key={permission.id}>{permission.name}</li>
              ))}
            </ul>
          </div>
        </div>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const roleId = e.dataTransfer.getData('text/plain');
            if (onDropRole) {
              // 确保传递当前用户的 selectedUserId
              onDropRole(user.id, roleId); // 原代码中未使用 user.id
            }
          }}
          className={styles.dropTarget} // 添加可视样式
        >
          添加角色
        </div>
      </div>
    );
  };
  
  export default UserDetails;