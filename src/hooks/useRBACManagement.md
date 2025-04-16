* **如何使用 async/await**：
  一般在数据请求的函数中，将 axios 调用封装成一个 async 函数，例如：

  // 示例：获取用户数据的函数</span><span>
  </span><span>import</span><span> axios </span><span>from</span><span> </span><span>'axios'</span><span>;

  </span><span>export</span><span> </span><span>const</span><span> </span><span>fetchUsers</span><span> = </span><span>async</span><span> (</span><span></span><span>) => {
  </span><span>try</span><span> {
  </span><span>const</span><span> response = </span><span>await</span><span> axios.</span><span>get</span><span>(</span><span>'/api/users'</span><span>);
  </span><span>return</span><span> response.</span><span>data</span><span>;
  } </span><span>catch</span><span> (error) {
  </span><span>console</span><span>.</span><span>error</span><span>(</span><span>"获取用户数据失败: "</span><span>, error);
  </span><span>throw</span><span> error;
  }
  };
  </span></span></code></div></div></pre>
* **加在哪里**：
  你可以将这些 axios 调用封装在自定义 Hook（例如 `useRBACManagement`）中，然后在初始化数据时使用 async/await。示例：

  // useRBACManagement.js 示例
  import { useState, useEffect } from 'react';
  import axios from 'axios';

  const useRBACManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
  const loadData = async () => {
  try {
  const [usersRes, rolesRes, permissionsRes] = await Promise.all([
  axios.get('/api/users'),
  axios.get('/api/roles'),
  axios.get('/api/permissions'),
  ]);
  setUsers(usersRes.data);
  setRoles(rolesRes.data);
  setPermissions(permissionsRes.data);
  } catch (err) {
  console.error('加载数据失败', err);
  }
  };

  loadData();
  }, []);

  // 定义一些操作方法，如 onRoleAssign, onRoleRemove, ...
  return { users, roles, permissions, /* ... */ };
  };

  export default useRBACManagement;

  这样可以确保网络请求异步执行，并且代码结构清晰。
