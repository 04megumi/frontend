import { useCallback } from 'react';

const useDragDrop = () => {
  /**
   * 处理拖拽开始时的事件，data 是需要传递的数据对象（比如{ type: 'role', roleId: xxx }）
   */
  const handleDragStart = useCallback((e, data) => {
    // 使用 JSON 字符串传递数据，数据类型清晰地写作 'application/json'
    e.dataTransfer.setData('application/json', JSON.stringify(data));
  }, []);

  /**
   * 处理拖拽时的 onDragOver 事件，阻止默认行为，允许放下
   */
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  /**
   * 处理 onDrop 事件，返回解析后的数据对象
   */
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (dataStr) {
        return JSON.parse(dataStr);
      }
    } catch (err) {
      console.error('Drop parsing error:', err);
    }
    return null;
  }, []);

  return {
    handleDragStart,
    handleDragOver,
    handleDrop,
  };
};

export default useDragDrop;
