import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Tree, Spin, message } from 'antd';
import useDragDrop from '../../../hooks/useDragDrop';
import styles from '../../../css/dashboard/rbac/RoleDetails.module.css';
import { loadRole } from "../../../api/role.js";
import { addRolePermission, deleteRolePermission } from "../../../api/rolePermission.js";
import { string } from 'prop-types';

const RoleDetails = ({ roleId, onAddPermission, onRemovePermission }) => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { handleDragStart } = useDragDrop();
  const draggedPermRef = useRef(null);

  // 加载角色权限数据
  useEffect(() => {
    if (!roleId) return;
    setLoading(true);

    const fetchRolePermissions = async () => {
      try {
        const response = await loadRole(roleId);
        if (response.success) {
          const permissionIds = response.data.data?.permissionIds || [];
          const permissionNodes = permissionIds
            .filter(pid => pid != null)
            .map(pid => ({
              title: String(pid),
              key: `perm-${pid}`
            })) || [];
          setPermissions(permissionNodes);
          console.log('权限节点数据:', permissionNodes);
        } else {
          throw new Error(response.data?.msg || '加载角色权限失败');
        }
      } catch (err) {
        console.error('加载失败:', err);
        setError(err.message);
        message.error(`加载失败: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRolePermissions();
  }, [roleId]);

  // 全局拖放处理（允许在容器外删除）
  useEffect(() => {
    const handleGlobalDragOver = (e) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
      }
    };
    const handleGlobalDrop = async (e) => {
      e.preventDefault();
      const pid = draggedPermRef.current;
      if (pid && roleId) { // 确保roleId存在
        try {
          await deleteRolePermission({
            roleId: roleId,
            permissionId: pid
          });
          // 更新前端状态
          onRemovePermission(pid);
          setPermissions(prev => prev.filter(p => p.title !== pid));
          message.success('权限删除成功');
        } catch (err) {
          message.error(`删除失败: ${err.message}`);
        }
      }
      draggedPermRef.current = null;
    };

    document.addEventListener('dragover', handleGlobalDragOver);
    document.addEventListener('drop', handleGlobalDrop);
    return () => {
      document.removeEventListener('dragover', handleGlobalDragOver);
      document.removeEventListener('drop', handleGlobalDrop);
    };
  }, [onRemovePermission, roleId]);

  // 添加权限的拖放处理
  const handleContainerDrop = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        if (data?.type === 'permission' && data.id && roleId) {
          const pid = data.id;
          if (!permissions.some(p => p.title === pid)) {

            // 调用添加API
            await addRolePermission({
              roleId: roleId,
              permissionId: pid
            });
            // 更新前端状态
            onAddPermission(pid);
            setPermissions(prev => [...prev, { title: pid, key: `perm-${pid}` }]);
            // message.success('权限添加成功');
            // 因为antd v5版本原因不支持静态方法的message，后续可以改成useMessage
          }
        }
      } catch (err) {
        // message.error(`添加失败: ${err.message}`);
      }
    },
    [onAddPermission, permissions, roleId]
  );

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
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleContainerDrop}
      style={{
        position: 'relative',
        minHeight: '300px',
      }}
    >
      <h4>{roleId}的权限</h4>
      <Tree
        className="draggable-tree"
        defaultExpandAll
        draggable
        blockNode
        treeData={permissions}
        onDragStart={(e, node) => {
          // 1. 检查事件对象和节点数据的有效性 
          if (!e || !e.dataTransfer || !node || !node.title) {
            console.error('事件或节点数据无效，拖拽已阻止', { e, node });
            return;
          }

          // 2. 设置拖拽效果
          try {
            e.dataTransfer.effectAllowed = 'move';
          } catch (err) {
            console.error('设置拖拽效果失败:', err);
            return;
          }

          // 3. 记录拖拽的权限ID
          draggedPermRef.current = node.title;

          // 4. 调用拖拽处理函数
          handleDragStart(e, {
            type: 'permission',
            id: node.title,
            timestamp: Date.now(),
            signature: Math.random().toString(36).slice(2)
          });
        }}
        allowDrop={false}
      />
    </div>
  );
};

export default RoleDetails;