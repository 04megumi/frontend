import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../css/dashboard/DashboardContainer.module.css';

const DashboardContainer = ({ children, activeSection }) => {
  return (
    <div className={styles.container}>
      <div className={styles.contentHeader}>
        <h1 className={styles.title}>
          {activeSection === 'rbac' && 'RBAC 管理'}
          {activeSection === 'monitoring' && 'Site Monitoring'}
          {activeSection === 'history' && '历史'}
        </h1>
        {activeSection === 'rbac' && (
          <div className={styles.controls}>
            <button
              className={styles.controlButton}
              onClick={() => window.dispatchEvent(new CustomEvent('toggleLayout'))}
            >
              View
            </button>
          </div>
        )}
      </div>
      <div className={styles.contentBody}>{children}</div>
    </div>
  );
};

DashboardContainer.propTypes = {
  activeSection: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onShowUserModal: PropTypes.func.isRequired,
  onShowRoleModal: PropTypes.func.isRequired,
  onShowPermissionModal: PropTypes.func.isRequired,
};

export default DashboardContainer;
