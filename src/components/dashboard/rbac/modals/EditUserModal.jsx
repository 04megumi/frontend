import React, { useState, useEffect } from 'react';
import { loadUser, modifyUser } from '../../../../api/user'

function EditUserModal({ name, onClose, onEditSuccess }) {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null); // 改为通用消息状态
  const [isSuccess, setIsSuccess] = useState(false); // 新增成功状态标识
  const fetch = async () => {
    const response = await loadUser(name);
    if (response.success) {
      setPassword(response.data.password);
      setEmail(response.data.email);
    }
  };
  const push = async () => {
    const response = await modifyUser({
      "name": name,
      "password": password,
      "email": email
    });
    if(response.success) {
      setIsSuccess(true);
      setMessage('用户修改成功');
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setIsSuccess(false);
      setMessage(response.message);
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };
  useEffect(() => {
    if (name) {
      fetch();
    }
  }, [name]);
  const handleEditUser = () => {
    push();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium text-gray-900">Edit User</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* 消息提示区 - 根据状态显示不同样式 */}
        {message && (
          <div
            className={`mb-4 p-3 border rounded ${isSuccess
                ? 'bg-green-100 border-green-400 text-green-700'
                : 'bg-red-100 border-red-400 text-red-700'
              }`}
          >
            {message}
          </div>
        )}
        <form className="space-y-4">
          <div className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-700">
            {name}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="留空则不修改"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="留空则不修改"
            />
          </div>
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
              onClick={handleEditUser}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Edit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserModal;
