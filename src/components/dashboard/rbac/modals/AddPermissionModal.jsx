import React, { useState } from 'react'

function AddPermissionModal({ onClose }) {
  const [permissionname, setPermissionname] = useState('')
  const [description, setDescription] = useState('')

  const handleAddPermission = () => {
    if(permissionname && description) {
      alert(`Added permission: ${permissionname}, ${description}`)
      onClose()
      // 重置表单逻辑...
    } else {
      alert('Please fill in all required fields')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium text-gray-900">Add New Permission</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Permissionname</label>
            <input 
              type="text" 
              value={permissionname} 
              onChange={(e)=> setPermissionname(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input 
              type="text" 
              value={description} 
              onChange={(e)=> setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          {/* Password 等字段可按需添加 */}
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Cancel
            </button>
            <button type="button" onClick={handleAddPermission} className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              Add Permission
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddPermissionModal
