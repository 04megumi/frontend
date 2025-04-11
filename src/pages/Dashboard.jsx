import React, { useState, useEffect } from 'react';
import styles from '../css/dashboard/Dashboard.module.css';
import UserList from '../components/dashboard/rbac/UserList';
import RoleList from '../components/dashboard/rbac/RoleList';
import PermissionList from '../components/dashboard/rbac/PermissionList';
import UserDetails from '../components/dashboard/rbac/UserDetails';
import RoleDetails from '../components/dashboard/rbac/RoleDetails';
import DeleteZone from '../components/dashboard/rbac/DeleteZone';
import Navbar from '../components/dashboard/navbar/NavBar';
import Sidebar from '../components/dashboard/sidebar/SideBar';
import ContextMenu from '../components/dashboard/contextmenu/ContextMenu';
import axios from 'axios';
import * as rbacApi from '../api/rbac';


const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
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
  const [activeSection, setActiveSection] = useState('rbac')
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, type: '', id: null })

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
    /*
    const loadData = async () => {
      try {
        setLoading(true);
        const [usersRes, rolesRes, permissionsRes] = await Promise.all([
          rbacApi.getUsers(),
          rbacApi.getRoles(),
          rbacApi.getPermissions(),
        ]);
        setUsers(usersRes.data);
        setRoles(rolesRes.data);
        setPermissions(permissionsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || '加载数据失败');
      } finally {
        setLoading(false);
      }
    };
    loadData();
    */
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
    switch (activeTab) {
      case 'rbac':
        // 根据选中角色判断是否为超管角色（假设超管角色名称为 "超管"）
        const selectedRole = roles.find(role => role.id === selectedRoleId);
        const isSuperAdmin = selectedRole && selectedRole.name === '超管';

        return (
          <div className={styles.contentSection}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>RBAC 管理</h2>
              <div>
                <button className={styles.layoutButton} onClick={toggleLayoutMode}>
                  Layout
                </button>
                <button className={styles.binButton} onClick={() => setShowDeleteZone(!showDeleteZone)}>
                  {showDeleteZone ? 'Bin Off' : 'Bin on'}
                </button>
              </div>
            </div>
            {layoutMode ? (
              // 页面1：用户列表、用户详情、角色列表
              <div className={styles.columnsContainer}>
                <div className={styles.column}>
                  <UserList users={users} onSelectUser={setSelectedUserId} />
                </div>
                <div className={styles.column}>
                  <UserDetails
                    user={users.find(user => user.id === selectedUserId)}
                    roles={roles}
                    permissions={permissions}
                    onRemoveRole={handleRemoveRoleFromUser}
                    onDropRole={handleDropRoleOnUser}
                  />
                </div>
                <div className={styles.column}>
                  <RoleList roles={roles} onDropRole={handleDropRoleOnUser} selectedUserId={selectedUserId} isDraggable={true} />
                </div>
              </div>
            ) : (
              // 页面2：角色列表、角色详情、权限列表
              <div className={styles.columnsContainer}>
                <div className={styles.column}>
                  <RoleList
                    roles={roles}
                    onSelectRole={setSelectedRoleId}
                    isDraggable={false}
                    selectedRoleId={selectedRoleId} // 传递当前选中角色ID
                  />
                </div>
                <div className={styles.column}>
                  <RoleDetails
                    role={selectedRole}
                    permissions={permissions}
                    // 如果是超管角色，则不允许删除或拖拽修改权限
                    onRemovePermission={!isSuperAdmin ? handleRemovePermissionFromRole : undefined}
                    onDropPermission={!isSuperAdmin ? handleDropPermissionOnRole : undefined}
                    readOnly={isSuperAdmin}
                  />
                </div>
                <div className={styles.column}>
                  <PermissionList permissions={permissions} />
                </div>
              </div>
            )}
            {showDeleteZone && (
              <div
                className={styles.deleteZone}
                onDrop={(e) => {
                  e.preventDefault();
                  const data = e.dataTransfer.getData('text/plain');
                  if (layoutMode) {
                    handleRemoveRoleFromUser(data);
                  } else {
                    handleRemovePermissionFromRole(data);
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                Trash Bin
              </div>
            )}
          </div>
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

        {/* <nav className={styles.navBar}>
           <div className={styles.navLeft}>
            <button
              className={styles.homeButton}
              onClick={() => setActiveTab('home')}
            >
              🏠 首页
            </button>
          </div> 
          <div className={styles.navRight}>
            <button
              className={`${styles.navButton} ${activeTab === 'rbac' ? styles.active : ''}`}
              onClick={() => setActiveTab('rbac')}
            >
              RBAC管理
            </button>
            <button
              className={`${styles.navButton} ${activeTab === 'sites' ? styles.active : ''}`}
              onClick={() => setActiveTab('sites')}
            >
              站点监控
            </button>
            <button
              className={`${styles.navButton} ${activeTab === 'history' ? styles.active : ''}`}
              onClick={() => setActiveTab('history')}
            >
              历史相关
            </button>
          </div>
        </nav> */}
        <Sidebar
          collapsed={sidebarCollapsed}
          setActiveSection={setActiveSection}
        />
        <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-0' : 'ml-[280px]'}`}>
          <Navbar toggleSidebar={toggleSidebar} />
          <main className={styles.mainContent}>{renderContent()}</main>
        </div>
        
      </div>

      {/* 贴进来的 
      

      
      {contextMenu.visible && <ContextMenu x={contextMenu.x} y={contextMenu.y} type={contextMenu.type} id={contextMenu.id} onHide={hideContextMenu} />}

      */}


    </div>

  );
};

export default Dashboard;