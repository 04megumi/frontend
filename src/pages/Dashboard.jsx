import React, { useState, useEffect } from 'react';
import DashboardContainer from '../components/dashboard/DashboardContainer.jsx';
import RBACManagement from '../components/dashboard/rbac/RBACManagement.jsx';
import Sidebar from '../components/dashboard/sidebar/Sidebar.jsx';
import AvatarSidebar from '../components/dashboard/sidebar/AvatarSidebar.jsx';
import Navbar from '../components/dashboard/navbar/Navbar.jsx';
import SiteMonitor from '../components/dashboard/siteMonitor/SiteMonitor.jsx';
import useRBACManagement from '../hooks/useRBACManagement.js';
import useSiteMonitor from '../hooks/useSiteMonitor.js';
import styles from '../css/dashboard/Dashboard.module.css';
import { me } from '../api/user.js';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [avatarSidebarCollapsed, setAvatarSidebarCollapsed] = useState(true);
  const [activeSection, setActiveSection] = useState('rbac');
  const [userName, setUserName] = useState();
  const navigate = useNavigate();
  const rbac = useRBACManagement();
  const monitoring = useSiteMonitor();
  useEffect(() => {
    const checkJwt = async () => {
      const response = await me();
      if (!response.success || !response.data.policies['rbac.login']) {
        navigate('/imageCarousel');
      }
    };
    checkJwt();
  }, []);

  return (
    <div className={styles.dashboardRoot}>
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onSectionChange={setActiveSection}
        userName={userName}
      />
      {/* AvatarSidebar */}
      <AvatarSidebar
        collapsed={avatarSidebarCollapsed}
        userName={userName}
      />
      {/* Main content area */}
      <main
        className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-0' : 'ml-[280px]'}`}
      >
        {/* Navbar Component */}
        <Navbar
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          toggleAvatarSidebar={() => setAvatarSidebarCollapsed(!avatarSidebarCollapsed)}
        />

        {/* DashboardContainer that holds the active section and modals */}
        <DashboardContainer
          activeSection={activeSection}
          onShowUserModal={() => setModals({ ...modals, user: true })}
          onShowRoleModal={() => setModals({ ...modals, role: true })}
          onShowPermissionModal={() => setModals({ ...modals, permission: true })}
        >
          {/* DashBoard内容 */}
          <section className={styles.dashboardContent}>
            {/* RBAC */}
            {activeSection === 'rbac' && (
              <RBACManagement
                users={rbac.users}
                roles={rbac.roles}
                permissions={rbac.permissions}
                onRoleAssign={rbac.handleRoleAssign}
                onPermissionAssign={rbac.handlePermissionAssign}
                onRoleRemove={rbac.handleRoleRemove}
                onPermissionRemove={rbac.handlePermissionRemove}
              />
            )}
            {/* 站点监控 */}
            {activeSection === 'monitoring' && <SiteMonitor />}
          </section>
        </DashboardContainer>
      </main>
    </div>
  );
};

export default Dashboard;
