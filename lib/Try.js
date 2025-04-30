import { jsx as _jsx } from 'react/jsx-runtime';
// 使用React.FC泛型定义组件类型
const Try = ({ title, onClick }) => {
  return _jsx('button', { onClick: onClick, children: title });
};
export default Try;
