import { useCallback } from 'react';

const useDragDrop = () => {
  const handleDragStart = useCallback((e, data) => {
    if (!e || !e.dataTransfer) {
      console.error('无效的拖拽事件对象');
      return;
    }
    e.dataTransfer.setData('application/json', JSON.stringify(data));
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    try {
      const raw = e.dataTransfer.getData('application/json');
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error('解析拖放数据失败:', error);
      return null;
    }
  }, []);

  return {
    handleDragStart,
    handleDragOver,
    handleDrop,
  };
};

export default useDragDrop;
