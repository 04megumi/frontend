// src/components/Try.tsx
import React from 'react';

// 定义组件的Props接口
interface TryProps {
  title: string;
  onClick: () => void;
}

// 使用React.FC泛型定义组件类型
const Try: React.FC<TryProps> = ({ title, onClick }) => {
  return (
    <button onClick={onClick}>
      {title}
    </button>
  );
};

export default Try;