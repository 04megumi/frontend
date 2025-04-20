import { useState, useEffect, useCallback } from 'react';
import { loadAllUserNames } from '../api/user'
import { loadAllRoleIds } from '../api/role'
import { loadAllPermissionIds } from '../api/permission'

const useRBACManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [userNames, setuserNames] = useState([]);
  const [roleIds, setRoleIds] = useState([]);
  const [permissionIds, setPermissionIds] = useState([]);

  // 用户角色管理
  const addUserRole = useCallback((userId, roleId) => {
    setUsers(prev => prev.map(u =>
      u.id === userId && !u.roles.includes(roleId)
        ? { ...u, roles: [...u.roles, roleId] }
        : u
    ));
  }, []);
  const removeUserRole = useCallback((userId, roleId) => {
    setUsers(prev => prev.map(u =>
      u.id === userId
        ? { ...u, roles: u.roles.filter(rid => rid !== roleId) }
        : u
    ));
  }, []);
  const dropUserRole = useCallback((userId, data) => {
    if (data?.type === 'role') {
      const roleId = data.version === '2.0' ? data.id : data.roleId;
      addUserRole(userId, roleId);
    }
  }, [addUserRole]);

  // 角色权限管理
  const addRolePermission = useCallback((roleId, permissionId) => {
    setRoles(prev => prev.map(r =>
      r.id === roleId && !r.permissions.includes(permissionId)
        ? { ...r, permissions: [...r.permissions, permissionId] }
        : r
    ));
  }, []);
  const removeRolePermission = useCallback((roleId, permissionId) => {
    setRoles(prev => prev.map(r =>
      r.id === roleId
        ? { ...r, permissions: r.permissions.filter(pid => pid !== permissionId) }
        : r
    ));
  }, []);
  const dropRolePermission = useCallback((roleId, data) => {
    if (data?.type === 'permission') {
      const permissionId = data.version === '2.0' ? data.id : data.permissionId;
      addRolePermission(roleId, permissionId);
    }
  }, [addRolePermission]);

  useEffect(() => {
    // 初始化模拟数据（同步部分）
    setUsers([
      { id: 'u1', name: 'Mori Lee', roles: ['r1'] },
      { id: 'u2', name: 'Seraphim Wei', roles: ['r2'] },
      { id: 'u3', name: 'wtz666', roles: ['r4'] },
      { id: 'u4', name: 'syz', roles: ['r3'] }
    ]);
    setRoles([
      { id: 'r1', name: '超管', permissions: ['p1','p2','p3','p4','p5','p6','p7','p8'] },
      { id: 'r2', name: '管理员', permissions: ['p1','p2','p3','p4'] },
      { id: 'r3', name: '历史管理员', permissions: ['p5','p6','p7'] },
      { id: 'r4', name: '访客', permissions: ['p8'] }
    ]);
    setPermissions([
      { id: 'p1', name: 'rbac.login' },
      { id: 'p2', name: 'rbac.modifyPermission' },
      { id: 'p3', name: 'rbac.modifyRole' },
      { id: 'p4', name: 'rbac.modifyUser' },
      { id: 'p5', name: 'history.file' },
      { id: 'p6', name: 'history.login' },
      { id: 'p7', name: 'history.train' },
      { id: 'p8', name: 'visit' }
    ]);
  
    const loadUsers = async () => {
      try {
        const userNamesResponse = await loadAllUserNames(); // 使用await等待异步操作完成
        setuserNames(userNamesResponse.data.data);
      } catch (error) {
        console.error('加载用户名失败:', error);
      }
    };

    const loadRoles = async () => {
      try {
        const RoleIdsR = await loadAllRoleIds(); 
        setRoleIds(RoleIdsR.data.data);
      } catch (error) {
        console.error('加载角色名失败:', error);
      }
    };

    const loadPermissions = async () => {
      try {
        const PermissionIdsR = await loadAllPermissionIds(); 
        setPermissionIds(PermissionIdsR.data.data);
      } catch (error) {
        console.error('加载用户名失败:', error);
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
    setuserNames,
    addUserRole,
    removeUserRole,
    dropUserRole,
    addRolePermission,
    removeRolePermission,
    dropRolePermission
  };
};

export default useRBACManagement;