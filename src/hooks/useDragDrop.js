import { useCallback } from 'react';

const useDragDrop = () => {

  //处理拖拽开始时的事件，data 是需要传递的数据对象（比如{ type: 'role', roleId: xxx }）
  const handleDragStart = useCallback((e, data) => {
    // 使用 JSON 字符串传递数据，数据类型清晰地写作 'application/json'
    e.dataTransfer.setData('application/json', JSON.stringify(data));
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault(); 
  }, []);

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
    handleDragStart,  // 拖拽开始：封装数据
    handleDragOver,   // 拖拽经过：允许放置
    handleDrop        // 拖拽释放：提取数据
  };
};

export default useDragDrop;
