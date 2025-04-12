import React from 'react'; 
import PropTypes from 'prop-types';
import styles from '../../css/dashboard/DashboardContainer.module.css';

const DashboardContainer = ({ 
  children, 
  activeSection,
  onShowUserModal,
  onShowRoleModal,
  onShowPermissionModal 
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.contentHeader}>
        <h1 className={styles.title}>
          {activeSection === 'rbac' && 'RBAC 管理'}
          {activeSection === 'monitoring' && '站点监控'}
          {activeSection === 'history' && '历史'}
        </h1>
        <div className={styles.actions}>
          <button 
            className={styles.actionButton}
            onClick={onShowUserModal}
          >
            + 用户
          </button>
          <button 
            className={styles.actionButton}
            onClick={onShowRoleModal}
          >
            + 角色
          </button>
          <button 
            className={styles.actionButton}
            onClick={onShowPermissionModal}
          >
            + 权限
          </button>
        </div>
      </div>
      <div className={styles.contentBody}>
        {children}
      </div>
    </div>
  );
};

DashboardContainer.propTypes = {
  activeSection: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onShowUserModal: PropTypes.func.isRequired,
  onShowRoleModal: PropTypes.func.isRequired,
  onShowPermissionModal: PropTypes.func.isRequired
};

export default DashboardContainer;