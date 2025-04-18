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

下面逐一说明各文件的职责与功能，帮你理清整个 RBAC 拖拽分配模块的架构和流程：

---

### 1. `Dashboard.jsx`

* **职责**：整个后台管理页面的入口，负责搭建最外层布局与路由切换（目前是两大板块：RBAC 管理 & 站点监控）。
* **功能**：
  * 管理侧边栏折叠状态（`sidebarCollapsed`）和当前激活 section（`activeSection`）。
  * 挂载全局 Hook（`useRBACManagement`、`useSiteMonitor`）来获取子板块所需的数据和操作接口。
  * 渲染 `Sidebar`、`Navbar`，并将 `activeSection` 和模态弹窗控制函数传给 `DashboardContainer`。
  * 根据 `activeSection` 决定在 `DashboardContainer` 内渲染 `<RBACManagement />` 还是 `<SiteMonitor />`。

---

### 2. `DashboardContainer.jsx`

* **职责**：承载主内容区的容器，统一处理标题、动作按钮（新增用户/角色/权限）和内部内容布局。
* **功能**：
  * 接收 `activeSection`，动态显示对应的页面标题（“RBAC 管理”、“站点监控” 或 “历史记录”）。
  * 提供三个“+ 用户”、“+ 角色”、“+ 权限”按钮的回调接口 `onShowUserModal` 等。
  * 将子组件（`children`）渲染在标题下方内容区域中。

---

### 3. `UserList.jsx`

* **职责**：展示用户列表并支持搜索、选中、右键菜单等操作。
* **核心功能**：
  * 接收 `users` 数组，按 `searchTerm` 过滤后渲染列表。
  * 点击某一行时调用 `onSelectUser(user.id)`，切换到该用户的详细视图。
  * （可选）通过 `onShowUserModal` 弹出新增用户模态框，通过 `onContextMenu` 响应右键自定义菜单。

---

### 4. `UserDetails.jsx`

* **职责**：展示单个用户的角色与权限树，并支持拖拽新增/移除角色。
* **核心功能**：
  1. **树形结构渲染**
     * 通过 Ant Design 的 `<Tree>`，将选中用户的角色映射成节点、再往下展示该角色对应的权限。
     * 自定义 `titleRender`，仅对“角色”节点绑定 `draggable` 和 `onDragStart`，启动拖拽。
  2. **外部拖入**
     * 根容器 `onDragOver` + `onDrop`，使用 `useDragDrop.handleDrop(e)` 解析拖入数据，调用 `onDropRole(userId, roleId)`。
  3. **拖出移除**
     * 在 `<Tree>` 上监听 `onDragEnd`：如果拖拽结束时指针已移出详情区，调用 `onRemoveRole(userId, roleId)`。

---

### 5. `RoleList.jsx`

* **职责**：展示角色列表，支持搜索、选中、右键菜单，并且能将角色拖出列表成为可分配对象。
* **核心功能**：
  * 按输入框中的 `searchTerm` 过滤角色后渲染。
  * 每个角色行都带 `draggable={isDraggable}`，在 `onDragStart` 调用 `useDragDrop.handleDragStart(e, { type:'role', roleId })` 序列化角色数据。
  * 点击行触发 `onSelectRole(role.id)`，右键触发 `onContextMenu`。

---

### 6. `RBACManagement.jsx`

* **职责**：组织 “用户列表 ↔ 角色列表 ↔ 用户详情” 三个板块的排布和数据流转。
* **核心功能**：
  * 使用 `useRBACManagement` 拿到 `users`, `roles`, `selectedUserId`, `userRoleMap` 及各类操作函数。
  * 左侧渲染 `<UserList>`，中间渲染 `<RoleList>`，右侧渲染 `<UserDetails>`。
  * 将列表组件和详情组件的回调（`onSelectUser`、`onDropRoleToUser`、`onRemoveRole`）全部打通，实现拖拽分配/移除角色的闭环。

---

### 7. `useRBACManagement.js`

* **职责**：全局状态管理 Hook，集中管理用户、角色、选中状态和用户角色映射。
* **核心功能**：
  * **状态**
    * `users`：用户数组
    * `roles`：角色数组
    * `selectedUserId`：当前聚焦用户 ID
    * `userRoleMap`：一个从 `userId` 到 `Set<roleId>` 的映射，存储每个用户的已分配角色
  * **方法**
    * `handleSelectUser(userId)`：切换当前聚焦用户
    * `handleAssignRole(userId, roleId)`：给某用户新增角色（Set 去重）
    * `handleDropRoleToUser(userId, droppedData)`：用于直接接收拖拽数据并分发给 `handleAssignRole`

---

### 8. `useDragDrop.js`

* **职责**：封装原生 Drag & Drop API，提供统一的拖拽数据序列化/解析接口。
* **核心功能**：
  * `handleDragStart(e, data)`：将任意 JS 对象 `data` 序列化为 JSON，写入 `e.dataTransfer`，供后续读取。
  * `handleDragOver(e)`：`e.preventDefault()`，让 drop 区真正可放置。
  * `handleDrop(e)`：从 `e.dataTransfer` 中读取 JSON 字符串并 `JSON.parse`，返回原始对象。

---

🔥 **工作流示意**：

1. 在 `RoleList` 中开始拖拽 → `dataTransfer` 写入 `{ type:'role', roleId }`
2. 拖到 `UserDetails` 容器上 → 容器 `onDrop`（或 Tree 内部 `onDrop`）触发 → `useDragDrop.handleDrop(e)` 解析 → 调用 `useRBACManagement.handleDropRoleToUser(userId, data)`
3. Hook 更新 `userRoleMap` → React 重新渲染 `UserDetails` 中的树，使新角色出现
4. 如果把角色从 `UserDetails` 内部拖出容器 → `Tree.onDragEnd` 检测到指针移出边界 → 调用 `onRemoveRole` → 更新 `userRoleMap` → React 再次渲染移除该角色
