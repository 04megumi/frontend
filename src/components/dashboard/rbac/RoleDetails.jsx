import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Tree, Spin, message } from 'antd';
import useDragDrop from '../../../hooks/useDragDrop';
import styles from '../../../css/dashboard/rbac/RoleDetails.module.css';
import { loadRole } from "../../../api/role.js";
import { addRolePermission, deleteRolePermission } from "../../../api/rolePermission.js";

const RoleDetails = ({ roleId, onAddPermission, onRemovePermission }) => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { handleDragStart, handleDragOver, handleDrop } = useDragDrop();
  const containerRef = useRef(null);
  const draggedPermRef = useRef(null);

  useEffect(() => {
    if (!roleId) return;
    setLoading(true);

    const handleGlobalDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    };



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
            }));
          setPermissions(permissionNodes);
        } else {
          throw new Error(response.data?.msg || '加载角色权限失败');
        }
      } catch (err) {
        setError(err.message);
        message.error(`加载失败: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRolePermissions();
    document.addEventListener('dragover', handleGlobalDragOver);
    return () => document.removeEventListener('dragover', handleGlobalDragOver);
  }, [roleId]);

  const handleDragEnd = useCallback(
    async (e) => {
      const nativeEvent = e.event; // 获取 AntD 传递的原生事件
      nativeEvent.dataTransfer.dropEffect = "move";
      const { clientX, clientY } = nativeEvent;
      const rect = containerRef.current?.getBoundingClientRect();
      const pid = draggedPermRef.current;

      if (!pid || !rect) return;

      const isOutside =
        clientX < rect.left - 10 ||
        clientX > rect.right + 10 ||
        clientY < rect.top - 10 ||
        clientY > rect.bottom + 10;

      if (isOutside) {
        try {
          await deleteRolePermission({ roleId, permissionId: pid });
          onRemovePermission(pid);
          setPermissions(prev => prev.filter(p => p.title !== pid));
          message.success('权限删除成功');
        } catch (err) {
          message.error(`删除失败: ${err.message}`);
        }
      }
      draggedPermRef.current = null;
    },
    [onRemovePermission, roleId]
  );

  const handleContainerDrop = useCallback(
    async (e) => {
      e.preventDefault();
      const data = handleDrop(e);
      if (data?.type === 'permission' && data.id && roleId) {
        const pid = data.id;
        if (!permissions.some(p => p.title === pid)) {
          try {
            const response = await addRolePermission({ roleId, permissionId: pid });
            if (response.success) {
              onAddPermission(pid);
              setPermissions(prev => [...prev, { title: pid, key: `perm-${pid}` }]);
            } else {
              message.error(`添加失败: ${response.data?.msg || '未知错误'}`);
            }
          } catch (err) {
            message.error(`添加失败: ${err.message}`);
          }
        }
      }
    },
    [handleDrop, onAddPermission, permissions, roleId]
  );

  if (!roleId) return <div className={styles.noRoleSelected}>请选择一个角色</div>;
  if (loading) {
    return (
      <Spin tip="加载中...">
        <div></div>
      </Spin>
    );
  }
  if (error) return <div className={styles.error}>加载失败: {error}</div>;

  return (
    <div
      className={styles.roleDetails}
      onDragOver={handleDragOver}
      onDrop={handleContainerDrop}
      ref={containerRef}
      style={{ position: 'relative', minHeight: '300px' }}
    >
      <h4>{roleId}的权限</h4>
      <Tree
        className="draggable-tree"
        defaultExpandAll
        draggable
        blockNode
        treeData={permissions}
        onDragStart={(event) => {
          const nativeEvent = event.event; // 获取 AntD 传递的原生事件
          const node = event.node;
          if (node && nativeEvent.dataTransfer) {
            draggedPermRef.current = node.title;
            handleDragStart(nativeEvent, { // 传递原生事件
              type: 'permission',
              id: node.title,
              timestamp: Date.now(),
              signature: Math.random().toString(36).slice(2),
            });
          } else {
            console.error('拖拽节点无效');
          }
        }}
        onDragEnd={handleDragEnd}
        allowDrop={false}
      />
    </div>
  );
};

export default RoleDetails;
