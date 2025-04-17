import React, { useState, useEffect } from 'react';
import DashboardContainer from '../components/dashboard/DashboardContainer.jsx';
import RBACManagement from '../components/dashboard/rbac/RBACManagement.jsx';
import useRBACManagement from '../hooks/useRBACManagement.js';
import useSiteMonitor from '../hooks/useSiteMonitor.js';
import Sidebar from '../components/dashboard/sidebar/Sidebar.jsx';
import Navbar from '../components/dashboard/navbar/Navbar.jsx';
import * as rbacApi from '../api/user.js';
import styles from '../css/dashboard/Dashboard.module.css';
import SiteMonitor from '../components/dashboard/siteMonitor/SiteMonitor.jsx';

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('rbac');
  const [modals, setModals] = useState({
    user: false,
    role: false,
    permission: false
  });

  const rbac = useRBACManagement();
  const monitoring = useSiteMonitor();

  return (
    <div className={styles.dashboardRoot}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onSectionChange={setActiveSection}
      />

      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-0' : 'ml-[280px]'  // 添加左边距避开侧边栏
        }`}>
        <Navbar
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <DashboardContainer
          activeSection={activeSection}
          onShowUserModal={() => setModals({ ...modals, user: true })}
          onShowRoleModal={() => setModals({ ...modals, role: true })}
          onShowPermissionModal={() => setModals({ ...modals, permission: true })}
        >
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
          {activeSection ==='monitoring' && (
            <SiteMonitor />
          )}
        </DashboardContainer>
      </div>
    </div>
  );
};

export default Dashboard;