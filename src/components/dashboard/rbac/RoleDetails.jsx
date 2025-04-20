import React, { useEffect, useState } from 'react';
import { Tree, Spin, message } from 'antd';
import styles from '../../../css/dashboard/rbac/RoleDetails.module.css';
import { loadRole } from "../../../api/role.js";

const RoleDetails = ({ roleId }) => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 加载角色权限数据
  useEffect(() => {
    if (!roleId) return;
    setLoading(true);
    
    const fetchRolePermissions = async () => {
      try {
        const response = await loadRole(roleId);
        if (response.success) {
          // 将权限列表转换为Tree组件需要的格式
          const permissionNodes = response.data.data?.permissionIds?.map(permissionId => ({
            title: `权限: ${permissionId}`,
            key: `perm-${permissionId}`
          })) || [];
          setPermissions(permissionNodes);
        } else {
          throw new Error(response.data?.msg || '加载角色权限失败');
        }
      } catch (err) {
        setError(err.message);
        message.error(`加载角色权限失败: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRolePermissions();
  }, [roleId]);

  if (!roleId) return <div className={styles.noRoleSelected}>请选择一个角色</div>;
  if (loading) return <Spin tip="加载中..." />;
  if (error) return <div className={styles.error}>加载失败: {error}</div>;

  return (
    <div className={styles.roleDetails}>
      <h4>{roleId}的权限</h4>
      <Tree
        treeData={permissions}
        defaultExpandAll
        showLine
        selectable={false}
      />
    </div>
  );
};

export default RoleDetails;
