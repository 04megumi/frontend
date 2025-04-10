import React from 'react';
import styles from '../../../css/dashboard/rbac/DeleteZone.module.css';

const DeleteZone = ({ onDrop }) => {
  return (
    <div
      className={styles.deleteZone}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      拖动项目到这里删除
    </div>
  );
};

export default DeleteZone;