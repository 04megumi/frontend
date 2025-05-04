import { useState, useEffect, useCallback } from 'react';
import { loadAllUserNames } from '../api/user.js';
import { loadAllRoleIds } from '../api/role.js';
import { loadAllPermissionIds } from '../api/permission.js';

const useRBACManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const [roleIds, setRoleIds] = useState([]);
  const [permissionIds, setPermissionIds] = useState([]);
  const addUserRole = useCallback((userName, roleId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.name === userName && !u.roles.includes(roleId)
          ? { ...u, roles: [...u.roles, roleId] }
          : u,
      ),
    );
  }, []);
  const removeUserRole = useCallback((userName, roleId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.name === userName ? { ...u, roles: u.roles.filter((rid) => rid !== roleId) } : u,
      ),
    );
  }, []);
  const dropUserRole = useCallback(
    (userName, data) => {
      if (data?.type === 'role') {
        const roleId = data.id;
        addUserRole(userName, roleId);
      }
    },
    [addUserRole],
  );
  // 角色权限管理
  const addRolePermission = useCallback((roleId, permissionId) => {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === roleId && !r.permissions.includes(permissionId)
          ? { ...r, permissions: [...r.permissions, permissionId] }
          : r,
      ),
    );
  }, []);
  const removeRolePermission = useCallback((roleId, permissionId) => {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === roleId
          ? {
              ...r,
              permissions: r.permissions.filter((pid) => pid !== permissionId),
            }
          : r,
      ),
    );
  }, [])
  const dropRolePermission = useCallback(
    (roleId, data) => {
      if (data?.type === 'permission') {
        const permissionId = data.id;
        addRolePermission(roleId, permissionId);
      }
    },
    [addRolePermission],
  );
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await loadAllUserNames();
        if(response.success) {
          setUserNames(response.data);
        } else {
          console.error('加载用户名失败:', response.message);
        }
      } catch (error) {
        console.error('加载用户名失败:', error);
      }
    };
    const loadRoles = async () => {
      try {
        const response = await loadAllRoleIds();
        if(response.success) {
          setRoleIds(response.data);
        } else {
          console.error('加载角色名失败:', response.message);
        }
      } catch (error) {
        console.error('加载角色名失败:', error);
      }
    };
    const loadPermissions = async () => {
      try {
        const response = await loadAllPermissionIds();
        if(response.success) {
          setPermissionIds(response.data);
        } else {
          console.error('加载权限名失败:', response.message);
        }
      } catch (error) {
        console.error('加载权限名失败:', error);
      }
    };
    loadUsers();
    loadRoles();
    loadPermissions();
  }, []);

  return {
    users,
    roles,
    permissions,
    userNames,
    roleIds,
    permissionIds,
    setUserNames,
    setRoleIds,
    setPermissionIds,
    addUserRole,
    removeUserRole,
    dropUserRole,
    addRolePermission,
    removeRolePermission,
    dropRolePermission,
  };
};

export default useRBACManagement;
