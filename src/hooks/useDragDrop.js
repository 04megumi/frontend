import { useCallback } from 'react';

const useDragDrop = () => {
  // 封装拖拽开始事件
  const handleDragStart = useCallback((e, data) => {
    e.dataTransfer.setData('application/json', JSON.stringify(data));
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  // 拖拽经过：允许放置
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);
  
  // 拖拽释放：提取数据
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    try {
      const raw = e.dataTransfer.getData('application/json');
      return JSON.parse(raw);
    } catch {
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