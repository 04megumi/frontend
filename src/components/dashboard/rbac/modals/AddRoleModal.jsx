import React, { useState } from 'react';
import { addRole } from '../../../../api/role';

function AddRoleModal({ onClose, onSuccess }) {
  const [roleId, setRoleId] = useState('');
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState(null); // 改为通用消息状态
  const [isSuccess, setIsSuccess] = useState(false); // 新增成功状态标识

  const handleAddRole = async () => {
    try {
      // 清空之前的状态
      setMessage(null);
      setIsSuccess(false);
      // 基础验证
      if (!roleId.trim()) {
        setMessage('角色Id不能为空');
        return;
      }
      const response = await addRole({
        id: roleId,
        name: roleName,
        description: description,
      });
      if (response.success) {
        setIsSuccess(true);
        setMessage('添加成功');
        // 1秒后自动关闭
        onSuccess(roleId);
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setMessage(response.error?.message || '请求失败，请稍后再试');
      }
    } catch (err) {
      setMessage('系统错误: ' + (err.message || '未知错误'));
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium text-gray-900">Add New Role</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* 消息提示区 - 根据状态显示不同样式 */}
        {message && (
          <div
            className={`mb-4 p-3 border rounded ${
              isSuccess
                ? 'bg-green-100 border-green-400 text-green-700'
                : 'bg-red-100 border-red-400 text-red-700'
            }`}
          >
            {message}
          </div>
        )}

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Id</label>
            <input
              type="text"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {/* Password 等字段可按需添加 */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddRole}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Add Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRoleModal;
