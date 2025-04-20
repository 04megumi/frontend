import React, { useEffect, useState } from 'react';
import { Tree, Spin, message } from 'antd';
import styles from '../../../css/dashboard/rbac/UserDetails.module.css';
import { loadUser } from "../../../api/user.js"
import { loadRole } from "../../../api/role.js"

const UserDetails = ({ userName }) => {
  const [roleIds, setRoleIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 加载用户角色数据
  useEffect(() => {
    if (!userName) return;
    setLoading(true);
    
    const fetchUserRoles = async () => {
      try {
        const response = await loadUser(userName);
        if (response.success) {
          // 获取所有角色及其权限
          const rolesWithPermissions = await Promise.all(
            response.data.data?.roleIds.map(async (roleId) => {
              const roleResponse = await loadRole(roleId);
              return {
                title: `角色: ${roleId}`,
                key: `role-${roleId}`,
                children: roleResponse.data.data?.permissionIds?.map(permissionId => ({
                  title: `权限: ${permissionId}`,
                  key: `perm-${roleId}-${permissionId}`
                })) || []
              };
            })
          );
          setRoleIds(rolesWithPermissions);
        } else {
          throw new Error(response.data?.msg || 'Failed to load user roles');
        }
      } catch (err) {
        setError(err.message);
        message.error(`加载用户角色失败: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserRoles();
  }, [userName]);

  if (!userName) return <div className={styles.noUserSelected}>请选择一个用户</div>;
  
  if (loading) return <Spin tip="加载中..." />;
  if (error) return <div className={styles.error}>加载失败: {error}</div>;

  return (
    <div className={styles.userDetails}>
      <h4>{userName}的详情</h4>
      <Tree
        treeData={roleIds}
        defaultExpandAll
        showLine
        selectable={false}
      />
    </div>
  );
};

export default UserDetails;
