import React, { useRef, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Tree } from 'antd';
import useDragDrop from '../../../hooks/useDragDrop';
import styles from '../../../css/dashboard/rbac/RoleDetails.module.css';

const getSafeArray = v => Array.isArray(v) ? v : [];
const createKey = (t, id) => `${t}-${id}`;

const RoleDetails = ({ role, permissions, onDropPermission, onRemovePermission }) => {
  const ref = useRef(null);
  const { handleDragStart, handleDragOver, handleDrop } = useDragDrop();
  const permIds = useMemo(() => getSafeArray(role?.permissions), [role]);
  const nodes = useMemo(() =>
  (role ? [{
    title: role.name, key: createKey('role', role.id), children:
      permIds.map(pid => ({
        title: permissions.find(p => p.id === pid)?.name || '',
        key: createKey('permission', pid),
        draggable: true,
        data: { type: 'permission', permissionId: pid }
      }))
  }] : []), [role, permIds, permissions]);

  const onDragEnd = useCallback(e => {
    const { clientX, clientY, dataTransfer } = e;
    const rect = ref.current.getBoundingClientRect();
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
      const data = JSON.parse(dataTransfer.getData('application/json'));
      if (data.permissionId) onRemovePermission(role.id, data.permissionId);
    }
  }, [onRemovePermission, role]);

  const onDropCap = useCallback(e => {
    handleDragOver(e);
    const data = handleDrop(e);
    if (data?.type === 'permission') {
      const pid = data.version === '2.0' ? data.id : data.permissionId;
      if (pid && !permIds.includes(pid)) onDropPermission(role.id, data);
    }
  }, [handleDragOver, handleDrop, onDropPermission, permIds, role]);

  if (!role) return <div className={styles.noRoleSelected}>请选择一个角色</div>;

  return (
    <div ref={ref} className={styles.roleDetails} onDragOver={handleDragOver} onDropCapture={onDropCap}>
      <h4>{role.name}'s Permissions</h4>
      <Tree
        treeData={nodes}
        draggable
        blockNode
        titleRender={nd =>
          nd.key.startsWith('permission-') ?
            <div draggable onDragStart={e => handleDragStart(e, { type: 'permission', permissionId: nd.data.permissionId })} style={{ cursor: 'move' }}>{nd.title}</div>
            : <span>{nd.title}</span>
        }
        onDragEnd={onDragEnd}
      />
    </div>
  );
};
RoleDetails.propTypes = {
  role: PropTypes.shape({ id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, name: PropTypes.string.isRequired, permissions: PropTypes.array }),
  permissions: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, name: PropTypes.string.isRequired })).isRequired,
  onDropPermission: PropTypes.func.isRequired,
  onRemovePermission: PropTypes.func.isRequired
};
RoleDetails.defaultProps = { role: null };
export default React.memo(RoleDetails);