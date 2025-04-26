import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Tree, Spin, message } from 'antd';
import useDragDrop from '../../../hooks/useDragDrop';
import styles from '../../../css/dashboard/rbac/RoleDetails.module.css';
import { loadRole } from "../../../api/role.js";

const RoleDetails = ({ roleId, onAddPermission, onRemovePermission }) => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { handleDragStart, handleDragOver, handleDrop } = useDragDrop();
  const containerRef = useRef(null); // 容器引用
  const draggedPermRef = useRef(null); // 跟踪当前拖动的权限ID

  // 加载角色权限数据
  useEffect(() => {
    if (!roleId) return;
    setLoading(true);

    const fetchRolePermissions = async () => {
      try {
        const response = await loadRole(roleId);
        if (response.success) {
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

  // 捕获外部 Drop 事件，添加新权限
  const handleContainerDrop = useCallback(
    e => {
      e.preventDefault();
      const data = handleDrop(e);
      if (data?.type === 'permission') {
        const pid = data.id; // 直接使用 data.id（兼容 v2.0）
        if (pid && !permissions.some(p => p.title === pid)) {
          onAddPermission(pid);
          setPermissions(prev => [...prev, { title: pid, key: `perm-${pid}` }]);
        }
      }
    },
    [handleDrop, onAddPermission, permissions]
  );

  // 节点拖出容器触发删除
  const handleDragEnd = useCallback(
    e => {
      e.preventDefault();
      e.stopPropagation();
      
      const pid = draggedPermRef.current;
      if (!pid) return;

      // 获取容器边界
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      // 计算鼠标释放位置
      const { clientX, clientY } = e;

      // 判断是否拖出容器
      const isOutside =
        clientX < rect.left - 10 || 
        clientX > rect.right + 10 ||
        clientY < rect.top - 10 ||
        clientY > rect.bottom + 10;

      if (isOutside) {
        console.log(`删除权限: ${pid}`); // 调试日志
        onRemovePermission(pid);
        setPermissions(prev => prev.filter(p => p.title !== pid));
      }
      draggedPermRef.current = null;
    },
    [onRemovePermission]
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
      ref={containerRef}
      className={styles.roleDetails}
      onDragOver={handleDragOver}
      onDrop={handleContainerDrop}
      onDragEnd={handleDragEnd} // 监听拖拽结束事件
      style={{ position: 'relative', minHeight: '300px', padding: '16px' }}
    >
      <h4>{roleId}的权限</h4>
      <Tree
        className="draggable-tree"
        defaultExpandAll
        draggable
        blockNode
        treeData={permissions}
        onDragStart={(e, node) => {
          draggedPermRef.current = node.title; // 记录拖动的权限ID
          handleDragStart(e, {
            version: '2.0',
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