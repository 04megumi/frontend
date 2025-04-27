import React, { useState, useEffect } from 'react';
import DashboardContainer from '../components/dashboard/DashboardContainer.jsx';
import RBACManagement from '../components/dashboard/rbac/RBACManagement.jsx';
import Sidebar from '../components/dashboard/sidebar/Sidebar.jsx';
import Navbar from '../components/dashboard/navbar/Navbar.jsx';
import SiteMonitor from '../components/dashboard/siteMonitor/SiteMonitor.jsx';
import useRBACManagement from '../hooks/useRBACManagement.js';
import useSiteMonitor from '../hooks/useSiteMonitor.js';
import styles from '../css/dashboard/Dashboard.module.css';
import { jwt } from "../api/user.js";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('rbac');
  const [modals, setModals] = useState({
    user: false,
    role: false,
    permission: false
  });

  const navigate = useNavigate();

  useEffect(() => {
      const checkJwt = async () => {
        const jwtToken = localStorage.getItem("jwt");
        const jwtR = await jwt(jwtToken);  
        if (!(
          jwtR.success &&
          jwtR.data.data &&
          jwtR.data.data.policies &&
          jwtR.data.data.policies['rbac.login'])) {
          navigate("/login");
        } 
      };
      checkJwt();
    }, []);

  const rbac = useRBACManagement();
  const monitoring = useSiteMonitor();

  return (
    <div className={styles.dashboardRoot}>
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onSectionChange={setActiveSection}/>
      {/* Main content area */}
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-0' : 'ml-[280px]'}`}>
        {/* Navbar Component */}
        <Navbar toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}/>
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
            {activeSection === 'monitoring' && ( <SiteMonitor /> )}
          </section>
        </DashboardContainer>
      </main>
    </div>
  );
};

export default Dashboard;