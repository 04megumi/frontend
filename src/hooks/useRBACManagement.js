import { useState, useEffect, useCallback } from 'react';

const useRBACManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  // 给用户添加角色
  const addUserRole = useCallback((userId, roleId) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId && !user.roles.includes(roleId)) {
        return {
          ...user,
          roles: [...user.roles, roleId]
        };
      }
      return user;
    }));
  }, []);

  // 从用户移除角色
  const removeUserRole = useCallback((userId, roleId) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          roles: user.roles.filter(id => id !== roleId)
        };
      }
      return user;
    }));
  }, []);

  // 拖放角色到用户
  const dropUserRole = useCallback((userId, data) => {
    if (data?.type === 'role') {
      const roleId = data.version === '2.0' ? data.id : data.roleId;
      addUserRole(userId, roleId);
    }
  }, [addUserRole]);

  const addRolePermission = useCallback((roleId, permissionId) => {
    setRoles(prev => prev.map(role => {
      if (role.id === roleId && !role.permissions.includes(permissionId)) {
        return {
          ...role,
          permissions: [...role.permissions, permissionId]
        };
      }
      return role;
    }));
  }, []);

  const removeRolePermission = useCallback((roleId, permissionId) => {
    setRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        return {
          ...role,
          permissions: role.permissions.filter(id => id !== permissionId)
        };
      }
      return role;
    }));
  }, []);

  const dropRolePermission = useCallback((roleId, data) => {
    if (data?.type === 'permission') {
      const permissionId = data.version === '2.0' ? data.id : data.permissionId;
      addRolePermission(roleId, permissionId);
    }
  }, [addRolePermission]);

  // 初始化示例数据
  useEffect(() => {
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
  }, []);

  return {
    users,
    roles,
    permissions,
    addUserRole,
    addRolePermission,
    removeUserRole,
    removeRolePermission,
    dropUserRole,
    dropRolePermission
  };
};

export default useRBACManagement;