import React from 'react';
import styles from '../../../css/dashboard/rbac/RoleDetails.module.css';

const RoleDetails = ({ role, permissions, onRemovePermission, onDropPermission }) => {
    if (!role) {
      return <div className={styles.noRoleSelected}>请选择一个角色</div>;
    }
  
    const rolePermissions = permissions.filter(permission =>
      role.permissions.includes(permission.id)
    );
  
    return (
      <div className={styles.roleDetails}>
        <h4>{role.name}'s Permissions</h4>
        <div className={styles.roleInfo}>
          <div className={styles.permissionsSection}>
            <h5>权限</h5>
            <ul>
              {rolePermissions.map(permission => (
                <li 
                key={permission.id} 
                draggable="true" 
                onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', permission.id);
                  }}
                >
                  {permission.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const permissionId = e.dataTransfer.getData('text/plain');
          if (onDropPermission) {
            onDropPermission(role.id, permissionId);
          }
        }}
        className={styles.dropTarget} // 添加可视样式
      >
        添加权限
      </div>
      </div>
    );
  };
  
  export default RoleDetails;