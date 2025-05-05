import React from 'react';
import styles from './ContextMenu.module.css';
import { deleteUser } from '../../../api/user';
import { deleteRole } from '../../../api/role';
import { deletePermission } from '../../../api/permission';
import useRBACManagement from '../../../hooks/useRBACManagement';

const ContextMenu = ({
  onClose,
  onContextMenu,
  userNames,
  setuserNames,
  contextMenuPosition,
  onEditClick,
  userName,
  roleId,
  permissionId,
  roleIds,
  setRoleIds,
  permissionIds,
  setPermissionIds,
  which,
}) => {
  const handleEdit = () => {
    onContextMenu('edit');
    onEditClick();
    onClose();
  };

  const handleDelete = async () => {
    if (which === 'user') {
      if (window.confirm(`Are you sure you want to delete this user?`)) {
        const response = await deleteUser({ name: userName });
        console.log(response);
        if (!response.success || !response.data.code === 100000) {
          console.log(response.data.msg);
        }
        setuserNames(userNames.filter((user) => user !== userName));
      }
      onClose();
    }
    if (which === 'role') {
      if (window.confirm(`Are you sure you want to delete this role?`)) {
        const response = await deleteRole({ id: roleId });
        console.log(response);
        if (!response.success || !response.data.code === 100000) {
          console.log(response.data.msg);
        }
        setRoleIds(roleIds.filter((role) => role !== roleId));
      }
      onClose();
    }
    if (which === 'permission') {
      if (window.confirm(`Are you sure you want to delete this permission?`)) {
        const response = await deletePermission({ id: userName });
        console.log(response);
        if (!response.success || !response.data.code === 100000) {
          console.log(response.data.msg);
        }
        setPermissionIds(permissionIds.filter((p) => p !== permissionId));
      }
      onClose();
    }
  };

  return (
    <div
      className={styles.contextMenu}
      style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
      onMouseLeave={onClose}>
      <div className={styles.contextMenuItem} onClick={() => {
        onEditClick();
        onClose();
      }}>
        <i className="fas fa-edit mr-2"></i> 编辑
      </div>
      <div className={styles.contextMenuItem} onClick={() => {
        handleDelete(); 
        onClose();
      }}>
        <i className="fas fa-trash mr-2"></i> 删除
      </div>
    </div>
  );
};

export default ContextMenu;
