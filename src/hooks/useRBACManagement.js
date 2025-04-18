import { useState, useEffect, useCallback } from 'react';

const useRBACManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  // 用户角色映射表（userId => Set of roleIds）
  const [userRoleMap, setUserRoleMap] = useState({});

  useEffect(() => {
    const dummyUsers = [
      { id: 'u1', name: 'Mori Lee', roles: ['r1'] },
      { id: 'u2', name: 'Seraphim Wei', roles: ['r2'] },
      { id: 'u3', name: 'wtz666', roles: ['r4'] },
      { id: 'u4', name: 'syz', roles: ['r3'] }
    ];
    const dummyRoles = [
      { id: 'r1', name: '超管', permissions: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'] },
      { id: 'r2', name: '管理员', permissions: ['p1', 'p2', 'p3', 'p4'] },
      { id: 'r3', name: '历史管理员', permissions: ['p5', 'p6', 'p7'] },
      { id: 'r4', name: '访客', permissions: ['p8'] },
    ];
    const dummyPermissions = [
      { id: 'p1', name: 'rbac.login' },
      { id: 'p2', name: 'rbac.modifyPermission' },
      { id: 'p3', name: 'rbac.modifyRole' },
      { id: 'p4', name: 'rbac.modifyUser' },
      { id: 'p5', name: 'history.file' },
      { id: 'p6', name: 'history.login' },
      { id: 'p7', name: 'history.train' },
      { id: 'p8', name: 'visit' },
    ];
    const dummyMap = {
      u1: new Set(['r1']),
      u2: new Set(['r2']),
      u3: new Set(['r4']),
      u4: new Set(['r3']),
    };

    setUsers(dummyUsers);
    setRoles(dummyRoles);
    setPermissions(dummyPermissions);
    setUserRoleMap(dummyMap); // 初始化 userRoleMap
  }, []);

  const handleSelectUser = useCallback((userId) => {
    setSelectedUserId(userId);
  }, []);

  // 分配角色给用户
  const handleAssignRole = useCallback((userId, roleId) => {
    setUserRoleMap((prevMap) => {
      const updatedMap = { ...prevMap };
      if (!updatedMap[userId]) {
        updatedMap[userId] = new Set();
      }
      updatedMap[userId].add(roleId);
      return { ...updatedMap };
    });
  }, []);

  const removeRole = useCallback((userId, roleId) => {
    setUserRoleMap(prev => {
      const next = { ...prev };
      if (next[userId]) {
        next[userId].delete(roleId);
      }
      return next;
    });
  }, []);

  const dropRole = useCallback((userId, data) => {
    if (data?.type === 'role') {
      handleAssignRole(userId, data.roleId); // 使用 handleAssignRole
    }
  }, [handleAssignRole]);

  return {
    users,
    roles,
    permissions,
    selectedUserId,
    userRoleMap,
    handleSelectUser,
    handleAssignRole,
    removeRole,
    dropRole,
  };
};

export default useRBACManagement;
