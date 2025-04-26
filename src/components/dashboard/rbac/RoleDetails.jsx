import React, { useEffect, useState, useCallback } from 'react';
import { Tree, Spin, message } from 'antd';
import useDragDrop from '../../../hooks/useDragDrop';
import styles from '../../../css/dashboard/rbac/RoleDetails.module.css';
import { loadRole } from "../../../api/role.js";

const RoleDetails = ({ roleId, onAddPermission, onRemovePermission }) => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { handleDragStart, handleDragOver, handleDrop } = useDragDrop();

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
            title: `${permissionId}`,
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

  // 统一拖过与放下处理：根容器既能 “接收添加”，也能 “接收删除”
  const onContainerDrop = useCallback((e) => {
    e.preventDefault();
    const data = handleDrop(e);
    if (!data || data.type !== 'permission') return;

    const permId = data.id;
    // 如果当前拖点是直接放在树节点里，就执行“添加”
    // 直接判断 e.target 是否在树内更为精确，可根据实际 DOM 调整
    if (e.target.closest('.ant-tree')) {
      // 已存在则跳过
      if (!permissions.some(n => n.key === `perm-${permId}`)) {
        const newNode = { title: permId, key: `perm-${permId}` };
        setPermissions(prev => [...prev, newNode]);
        onAddPermission(permId);
      }
    } else {
      // 放到容器外：执行“删除”
      setPermissions(prev => prev.filter(n => n.key !== `perm-${permId}`));
      onRemovePermission(permId);
    }
  }, [handleDrop, onAddPermission, onRemovePermission, permissions]);

  if (!roleId) return <div className={styles.noRoleSelected}>请选择一个角色</div>;
  if (loading) {
    return (
      <Spin tip="加载中..." >
        {/* 需要加载的内容 */}
        <div></div>
      </Spin>)
  };
  if (error) return <div className={styles.error}>加载失败: {error}</div>;

  return (
    <div
      className={styles.roleDetails}
      onDragOver={handleDragOver}
      onDrop={onContainerDrop}
      style={{ position: 'relative' }}
    >
      <h4>{roleId}的权限</h4>
      <Tree
        className="draggable-tree"
        defaultExpandAll
        draggable
        blockNode
        treeData={permissions}
        onDragStart={(e, node) => {
          handleDragStart(e, {
            version: '2.0',
            type: 'permission',
            id: node.title,   // 节点 title 就是权限 ID
            timestamp: Date.now(),
            signature: Math.random().toString(36).slice(2)
          });
        }}        
        allowDrop={false}
      />
      {/* 还可以在这加“回收站”图标引导用户 */}
    </div>
  );
};

export default RoleDetails;
