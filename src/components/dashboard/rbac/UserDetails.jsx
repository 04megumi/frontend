import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Tree, Spin, message } from 'antd';
import useDragDrop from '../../../hooks/useDragDrop.js';
import styles from '../../../css/dashboard/rbac/UserDetails.module.css';
import { loadUser } from '../../../api/user.js';
import { loadRole } from '../../../api/role.js';
import { addUserRole, deleteUserRole } from '../../../api/userRole.js';

const UserDetails = ({ userName, onAddRole, onRemoveRole }) => {
  const [roleIds, setRoleIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { handleDragStart, handleDragOver, handleDrop } = useDragDrop();
  const containerRef = useRef(null);
  const draggedRoleIdRef = useRef(null); // 更改变量名以明确存储的是角色ID

  useEffect(() => {
    if (!userName) return;
    setLoading(true);
    const handleGlobalDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    };

    const fetchUserRoles = async () => {
      try {
        const response = await loadUser(userName);
        console.log(response);
        if (response.success) {
          const rolesWithPermissions = await Promise.all(
            response.data?.roleIds.map(async (roleId) => {
              const roleResponse = await loadRole(roleId);
              console.log(roleResponse);
              return {
                title: `角色: ${roleId}`, // 显示友好名称
                key: `role-${roleId}`,
                roleId: roleId, // 存储原始ID用于逻辑操作
                children:
                  roleResponse.data?.permissionIds?.map((permissionId) => ({
                    title: `权限: ${permissionId}`,
                    key: `perm-${roleId}-${permissionId}`,
                  })) || [],
              };
            }),
          );
          console.log("111");
          setRoleIds(rolesWithPermissions);
        } else {
          throw new Error(response.msg || '加载用户角色失败');
        }
      } catch (err) {
        setError(err.message);
        message.error(`加载失败: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoles();
    document.addEventListener('dragover', handleGlobalDragOver);
    return () => document.removeEventListener('dragover', handleGlobalDragOver);
  }, [userName]);

  const handleDragEnd = useCallback(
    async (e) => {
      const nativeEvent = e.event;
      const { clientX, clientY } = nativeEvent;
      const rect = containerRef.current?.getBoundingClientRect();
      const roleId = draggedRoleIdRef.current; // 使用存储的纯角色ID

      if (!roleId || !rect) return;

      // 计算是否在容器外（含10px缓冲）
      const isOutside =
        clientX < rect.left - 10 ||
        clientX > rect.right + 10 ||
        clientY < rect.top - 10 ||
        clientY > rect.bottom + 10;

      if (isOutside) {
        try {
          const response = await deleteUserRole({
            name: userName,
            roleId: roleId,
          });
          if (response.success && response.data.code === 100000) {
            onRemoveRole(roleId);
            setRoleIds((prev) => prev.filter((role) => role.roleId !== roleId));
            message.success('角色删除成功');
          } else {
            message.error('角色删除失败');
          }
        } catch (err) {
          message.error(`删除失败: ${err.message}`);
        }
      }
      draggedRoleIdRef.current = null;
    },
    [onRemoveRole, userName],
  );

  const handleContainerDrop = useCallback(
    async (e) => {
      e.preventDefault();
      const data = handleDrop(e);
      if (data?.type === 'roleId' && data.id && userName) {
        const roleId = data.id;
        // 检查是否已存在该角色
        if (!roleIds.some((role) => role.roleId === roleId)) {
          try {
            const response = await addUserRole({
              name: userName,
              roleId: roleId,
            });
            if (response.success && response.data.code === 100000) {
              onAddRole(roleId);
              setRoleIds((prev) => [
                ...prev,
                {
                  title: `角色: ${roleId}`,
                  key: `role-${roleId}`,
                  roleId: roleId,
                  children: [], // 初始无子节点，实际可按需加载
                },
              ]);
              message.success('角色添加成功');
            } else {
              message.error(`添加失败: ${response.data?.msg || '未知错误'}`);
            }
          } catch (err) {
            message.error(`添加失败: ${err.message}`);
          }
        }
      }
    },
    [handleDrop, roleIds, onAddRole, userName],
  );

  if (!userName) return <div className={styles.noUserSelected}>请选择一个用户</div>;

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
      className={styles.userDetails}
      onDragOver={handleDragOver}
      onDrop={handleContainerDrop}
      ref={containerRef}
      style={{ position: 'relative', minHeight: '300px' }}
    >
      <h4>{userName}的角色</h4>
      <Tree
        className="draggable-tree"
        defaultExpandAll
        draggable
        blockNode
        treeData={roleIds}
        onDragStart={(event) => {
          const nativeEvent = event.event;
          const node = event.node;
          if (node && nativeEvent.dataTransfer) {
            draggedRoleIdRef.current = node.roleId; // 存储纯角色ID
            handleDragStart(nativeEvent, {
              type: 'roleId',
              id: node.roleId, // 传递纯ID
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

export default UserDetails;
