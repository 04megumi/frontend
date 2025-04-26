import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ContextMenu from '../contextMenu/ContextMenu.jsx';
import useDragDrop from '../../../hooks/useDragDrop';
import styles from '../../../css/dashboard/rbac/PermissionList.module.css';

const PermissionList = ({ permissionIds, isDraggable, onSelectPermission, onContextMenu }) => {
  const [term, setTerm] = useState('');
  const [ctxPos, setCtxPos] = useState({ x: 0, y: 0 });
  const [showCtx, setShowCtx] = useState(false);
  const [selPerm, setSelPerm] = useState(null);
  const { handleDragStart } = useDragDrop();

  const filtered = permissionIds.filter(p => p.toLowerCase().includes(term.toLowerCase()));
  const onCtx = (e, p) => { e.preventDefault(); setCtxPos({ x: e.clientX, y: e.clientY }); setSelPerm(p); setShowCtx(true); };

  return (
    <div className={styles.permissionListContainer} style={{ maxHeight: '600px', overflowY: 'auto' }}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="搜索权限..."
          value={term}
          onChange={e => setTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.permissionList} style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <h4>Permissions</h4>
        <div className={styles.permissions}>
          {filtered.map(p => (
            <div
              key={p}
              className={styles.permission}
              draggable={isDraggable}
              onDragStart={e => {
                e.stopPropagation();
                handleDragStart(e, {
                  version: '2.0',
                  type: 'permission',
                  id: p,
                  timestamp: Date.now(),
                  signature: Math.random().toString(36).slice(2)
                });
              }}
              onClick={() => onSelectPermission && onSelectPermission(p)}
              onContextMenu={e => onCtx(e, p)}
              data-testid={`perm-item-${p}`}
            >
              {p}
            </div>
          ))}
        </div>
      </div>
      {showCtx && <ContextMenu onClose={() => setShowCtx(false)} onContextMenu={action => onContextMenu(action, selPerm)} contextMenuPosition={ctxPos} menuItems={[{ label: '编辑权限', action: 'edit' }, { label: '删除权限', action: 'delete' }, { label: '复制ID', action: 'copyId' }]} />}
    </div>
  );
};

PermissionList.propTypes = {
  permissionIds: PropTypes.array.isRequired,
  isDraggable: PropTypes.bool,
  onSelectPermission: PropTypes.func,
  onContextMenu: PropTypes.func
};

PermissionList.defaultProps = {
  isDraggable: false,
  onSelectPermission: null,
  onContextMenu: () => { }
};

export default PermissionList;
