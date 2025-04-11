import React, { useState } from 'react'

function Sidebar({ collapsed, setActiveSection }) {
  // 控制各个子菜单的显示状态
  const [submenu, setSubmenu] = useState({
    rbac: false,
    monitoring: false,
    history: false,
  })

  const toggleSubmenu = (menu) => {
    setSubmenu(prev => ({ ...prev, [menu]: !prev[menu] }))
  }

  // 示例：点击菜单项后切换主内容显示
  const handleMenuClick = (section) => {
    setActiveSection(section)
  }

  return (
    <div className={`sidebar fixed h-full bg-white shadow-md transition-transform duration-300 ${collapsed ? '-translate-x-[280px]' : 'translate-x-0'}`}>
      <div className="p-4 h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        {/* 搜索框 */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
        {/* 菜单 */}
        <div className="flex-1 overflow-y-auto">
          <div className="mb-4">
            <div
              className="flex justify-between items-center cursor-pointer group"
              onClick={() => { toggleSubmenu('rbac'); handleMenuClick('rbac') }}
            >
              <span className="font-medium text-gray-700 group-hover:text-blue-600">RBAC</span>
              <i className={`fas ${submenu.rbac ? 'fa-minus' : 'fa-plus'} text-gray-400 group-hover:text-blue-600`}></i>
            </div>
            {submenu.rbac && (
              <div className="pl-4 mt-2">
                <a href="#!" className="block py-2 text-gray-600 hover:text-blue-600" onClick={() => setActiveSection('RBACManagement')}>User Management</a>
                <a href="#!" className="block py-2 text-gray-600 hover:text-blue-600">Role Management</a>
                <a href="#!" className="block py-2 text-gray-600 hover:text-blue-600">Permission Management</a>
              </div>
            )}
          </div>
          <div className="mb-4">
            <div
              className="flex justify-between items-center cursor-pointer group"
              onClick={() => { toggleSubmenu('monitoring'); handleMenuClick('monitoring') }}
            >
              <span className="font-medium text-gray-700 group-hover:text-blue-600">Site Monitoring</span>
              <i className={`fas ${submenu.monitoring ? 'fa-minus' : 'fa-plus'} text-gray-400 group-hover:text-blue-600`}></i>
            </div>
            {submenu.monitoring && (
              <div className="pl-4 mt-2">
                <a href="#!" className="block py-2 text-gray-600 hover:text-blue-600">Dashboard</a>
                <a href="#!" className="block py-2 text-gray-600 hover:text-blue-600">Alerts</a>
                <a href="#!" className="block py-2 text-gray-600 hover:text-blue-600">Logs</a>
              </div>
            )}
          </div>
          <div className="mb-4">
            <div
              className="flex justify-between items-center cursor-pointer group"
              onClick={() => { toggleSubmenu('history'); handleMenuClick('history') }}
            >
              <span className="font-medium text-gray-700 group-hover:text-blue-600">History</span>
              <i className={`fas ${submenu.history ? 'fa-minus' : 'fa-plus'} text-gray-400 group-hover:text-blue-600`}></i>
            </div>
            {submenu.history && (
              <div className="pl-4 mt-2">
                <a href="#!" className="block py-2 text-gray-600 hover:text-blue-600">Documents</a>
                <a href="#!" className="block py-2 text-gray-600 hover:text-blue-600">Archives</a>
                <a href="#!" className="block py-2 text-gray-600 hover:text-blue-600">Reports</a>
              </div>
            )}
          </div>
        </div>
        {/* 用户信息 */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Profile" className="w-10 h-10 rounded-full" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Jane Smith</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
