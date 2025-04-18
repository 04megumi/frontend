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
    console.log('原生事件对象:', e); // 调试日志
    try {
      const dataStr = e.dataTransfer.getData('application/json');
      console.log('原始拖拽数据字符串:', dataStr); // 调试日志
      if (dataStr) {
        const data = JSON.parse(dataStr);
        console.log('handleDrop 解析成功:', data);
        return data; // 返回解析后的数据对象
      }
    } catch (err) {
      console.error('解析失败:', err);
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
