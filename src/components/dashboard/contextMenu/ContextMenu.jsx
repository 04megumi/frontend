import React from 'react';
import styles from './ContextMenu.module.css';

const ContextMenu = ({ onClose, onContextMenu, contextMenuPosition }) => {
  const handleEdit = () => {
    onContextMenu('edit');
    onclick
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete this user?`)) {
      onContextMenu('delete');
    }
    onClose();
  };

  return (
    <div 
      className={styles.contextMenu}
      style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
      onMouseLeave={onClose}
    >
      <div className={styles.contextMenuItem} onClick={handleEdit}>
        <i className="fas fa-edit mr-2"></i> 编辑
      </div>
      <div className={styles.contextMenuItem} onClick={handleDelete}>
        <i className="fas fa-trash mr-2"></i> 删除
      </div>
    </div>
  );
}

export default ContextMenu;
