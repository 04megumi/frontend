import { useCallback } from 'react';

const useDragDrop = () => {
  // 封装拖拽开始事件
  const handleDragStart = useCallback((e, data) => {
    // 手动创建 DataTransfer 对象
    const dataTransfer = {
      data: {},
      setData(type, value) {
        this.data[type] = value;
      },
      getData(type) {
        return this.data[type] || '';
      },
      effectAllowed: 'move',
      dropEffect: 'move',
    };

    // 将 DataTransfer 对象赋值给事件对象
    e.dataTransfer = dataTransfer;

    // 设置拖拽数据
    e.dataTransfer.setData('application/json', JSON.stringify(data));

    // 设置允许的拖拽操作类型
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  // 拖拽经过：允许放置
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';  // 允许移动
  }, []);

  // 拖拽释放：提取数据
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    try {
      const raw = e.dataTransfer.getData('application/json');
      return JSON.parse(raw);  // 返回解析后的数据
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
