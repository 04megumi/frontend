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
  const containerRef = useRef(null);
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
            }));
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

  // 节点拖出容器触发删除
  const handleDragEnd = useCallback(
    async (e) => {
      const { clientX, clientY } = e;
      const rect = containerRef.current?.getBoundingClientRect();
      const pid = draggedPermRef.current;

      if (!pid) {
        console.error('未找到拖拽的权限 ID');
        return;
      }

      // 判断是否拖出容器边界
      if (rect && pid && roleId && (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      )) {
        try {
          // 调用删除API
          await deleteRolePermission({
            roleId,
            permissionId: pid
          });

          // 更新前端状态
          onRemovePermission(pid);
          setPermissions((prev) => prev.filter((p) => p.title !== pid));
          message.success('权限删除成功');
        } catch (err) {
          message.error(`删除失败: ${err.message}`);
        }
      }
      draggedPermRef.current = null;
    },
    [onRemovePermission, roleId]
  );

  {/*const onDragStart = async (info) => {
    // 假设这里有异步操作
    await someAsyncFunction();
    
    // 打印当前拖拽的节点
    console.log("Drag started on node:", info.node);
  };*/}

  const handleContainerDrop = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        if (data?.type === 'permission' && data.id && roleId) {
          const pid = data.id;
          if (!permissions.some(p => p.title === pid)) {
            console.log('准备添加权限:', { roleId, permissionId: pid });
            // 调用添加权限的 API
            const response = await addRolePermission({
              roleId: roleId,
              permissionId: pid
            });
            if (response.success) {
              // 更新前端状态
              onAddPermission(pid);
              setPermissions(prev => [...prev, { title: pid, key: `perm-${pid}` }]);
              // message.success('权限添加成功');
              // 因为antd v5版本原因（目前是v5.24.8，应该是支持的，但是不知道为啥报错）不支持静态方法的message，后续可以改成useMessage
            } else {
              message.error(`添加失败: ${response.data?.msg || '未知错误'}`);
            }
          }
        }
      } catch (err) {
        console.error('添加权限失败:', err);
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
        onDragStart={(event) => {
          const node = event.node;
          if (node) {
            draggedPermRef.current = node.title;
            handleDragStart(event, {
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