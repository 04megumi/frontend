import React, { useState, useEffect } from 'react';
import styles from '../css/dashboard/Dashboard.module.css';
import Navbar from '../components/dashboard/navbar/Navbar.jsx';
import Sidebar from '../components/dashboard/sidebar/Sidebar.jsx';
import RBACManagement from '../components/dashboard/rbac/RBACManagement.jsx';
import ContextMenu from '../components/dashboard/contextmenu/ContextMenu.jsx';
import AddUserModal from '../components/dashboard/rbac/modals/AddUserModal.jsx';
import AddRoleModal from '../components/dashboard/rbac/modals/AddRoleModal.jsx';
import AddPermissionModal from '../components/dashboard/rbac/modals/AddPermissionModal.jsx';
import axios from 'axios';
import * as rbacApi from '../api/rbac';


const Dashboard = () => {
  const [refreshCount, setRefreshCount] = useState(0);
  const [layoutMode, setLayoutMode] = useState(true); // true 为第一种布局，false 为第二种布局
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [showDeleteZone, setShowDeleteZone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeSection, setActiveSection] = useState(null);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, type: '', id: null })
  const [showUserModal, setShowUserModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showPermissionModal, setShowPermissionModal] = useState(false)


  // 切换侧边栏状态
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed)

  // 显示右键菜单（简单示例，可进一步扩展）
  const handleContextMenu = (e, type, id) => {
    e.preventDefault()
    setContextMenu({ visible: true, x: e.pageX, y: e.pageY, type, id })
  }

  // 隐藏右键菜单
  const hideContextMenu = () => setContextMenu({ ...contextMenu, visible: false })


  // 初始化加载数据，从后端获取用户、角色、权限信息
  useEffect(() => {
    setUsers([]);
    setRoles([]);
    setPermissions([]);
    setLoading(false);
  }, []);


  // 为用户添加角色
  const handleDropRoleOnUser = async (userId, roleId) => {
    try {
      await rbacApi.addRoleToUser(userId, roleId);
      setUsers(users.map(user =>
        user.id === userId
          ? { ...user, roles: [...user.roles, roleId] }
          : user
      ));
    } catch (err) {
      console.error('添加角色失败:', err);
      alert('操作失败: ' + (err.response?.data?.message || '未知错误'));
    }
  };

  // 为角色添加权限
  const handleDropPermissionOnRole = async (roleId, permissionId) => {
    try {
      await rbacApi.addPermissionToRole(roleId, permissionId);
      setRoles(roles.map(role =>
        role.id === roleId
          ? { ...role, permissions: [...role.permissions, permissionId] }
          : role
      ));
    } catch (err) {
      console.error('添加权限失败:', err);
      alert('操作失败: ' + (err.response?.data?.message || '未知错误'));
    }
  };

  // 删除用户的角色
  const handleRemoveRoleFromUser = async (roleId) => {
    if (!selectedUserId) return;
    try {
      await rbacApi.removeRoleFromUser(selectedUserId, roleId);
      setUsers(users.map(user =>
        user.id === selectedUserId
          ? { ...user, roles: user.roles.filter(r => r !== roleId) }
          : user
      ));
    } catch (err) {
      console.error('删除角色失败:', err);
      alert('操作失败: ' + (err.response?.data?.message || '未知错误'));
    }
  };

  // 删除角色的权限
  const handleRemovePermissionFromRole = async (permissionId) => {
    if (!selectedRoleId) return;
    try {
      await rbacApi.removePermissionFromRole(selectedRoleId, permissionId);
      setRoles(roles.map(role =>
        role.id === selectedRoleId
          ? { ...role, permissions: role.permissions.filter(p => p !== permissionId) }
          : role
      ));
    } catch (err) {
      console.error('删除权限失败:', err);
      alert('操作失败: ' + (err.response?.data?.message || '未知错误'));
    }
  };

  const toggleLayoutMode = () => {
    setLayoutMode(!layoutMode);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'RBACManagement':
        return (
          <RBACManagement
            layoutMode={layoutMode}
            toggleLayoutMode={() => setLayoutMode(!layoutMode)}
            showDeleteZone={showDeleteZone}
            setShowDeleteZone={setShowDeleteZone}
            users={users}
            roles={roles}
            permissions={permissions}
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
            selectedRoleId={selectedRoleId}
            setSelectedRoleId={setSelectedRoleId}
            handleRemoveRoleFromUser={handleRemoveRoleFromUser}
            handleDropRoleOnUser={handleDropRoleOnUser}
            handleRemovePermissionFromRole={handleRemovePermissionFromRole}
            handleDropPermissionOnRole={handleDropPermissionOnRole}
          />
        );
      case 'sites':
        return (
          <div className={styles.contentSection}>
            <h2>站点监控</h2>
            <div className={styles.columnsContainer}>
              <div className={styles.column}>
                <p>流量数据：{Math.random() * 1000} visits</p>
              </div>
            </div>
          </div>
        );
      case 'history':
        return (
          <div className={styles.contentSection}>
            <h2>历史相关</h2>
            <div className={styles.columnsContainer}>
              <div className={styles.column}>
                <ul>
                  <li>文献 1</li>
                  <li>文献 2</li>
                </ul>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className={styles.contentSection}>
            <h2>欢迎使用仪表盘</h2>
            <button
              className={styles.refreshButton}
              onClick={() => setRefreshCount(c => c + 1)}
            >
              刷新内容 (已刷新 {refreshCount} 次)
            </button>
          </div>
        );
    }
  };

  if (loading) return <div className={styles.loading}>加载中...</div>;
  if (error) return <div className={styles.error}>错误: {error}</div>;

  return (
    <div className="flex">
      <div className={styles.dashboard}>
        <Sidebar
          collapsed={sidebarCollapsed}
          setActiveSection={setActiveSection}
        />
        <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-0' : 'ml-[280px]'}`}>
          <Navbar toggleSidebar={toggleSidebar} />
          <div className={styles.dashboard}>
            <main className={styles.mainContent}>
              {renderContent()}
            </main>
          </div>
          <div className="main-content">
            {activeSection === 'rbac' && <div>RBAC Section Content</div>}
            {activeSection === 'monitoring' && <div>Site Monitoring Content</div>}
            {activeSection === 'history' && <div>History Content</div>}
            {showUserModal}={() => setShowUserModal(true)}
            {showRoleModal}={() => setShowRoleModal(true)}
            {showPermissionModal}={() => setShowPermissionModal(true)}
            {contextMenu}={handleContextMenu}
          </div>
        </div>
        {contextMenu.visible && <ContextMenu x={contextMenu.x} y={contextMenu.y} type={contextMenu.type} id={contextMenu.id} onHide={hideContextMenu} />}
        {showUserModal && <AddUserModal onClose={() => setShowUserModal(false)} />}
        {showRoleModal && <AddRoleModal onClose={() => setShowRoleModal(false)} />}
        {showPermissionModal && <AddPermissionModal onClose={() => setShowPermissionModal(false)} />}
      </div>

    </div>

  );
};

export default Dashboard;