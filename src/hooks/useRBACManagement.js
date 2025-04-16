import { useState, useEffect } from 'react';
import axios from 'axios';

const useRBACManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    // 模拟后端数据
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

    // 模拟网络延迟
    setTimeout(() => {
      setUsers(dummyUsers);
      setRoles(dummyRoles);
      setPermissions(dummyPermissions);
    }, 500);
  }, []);

  // 定义角色赋予、移除等操作（暂时可以直接更新状态）
  const handleRoleAssign = (userId, roleId) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId && !user.roles.includes(roleId)
          ? { ...user, roles: [...user.roles, roleId] }
          : user
      )
    );
  };

  const handleRoleRemove = (userId, roleId) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId
          ? { ...user, roles: user.roles.filter(r => r !== roleId) }
          : user
      )
    );
  };

  return {
    users,
    roles,
    permissions,
    handleRoleAssign,
    handleRoleRemove,
  };
};

export default useRBACManagement;