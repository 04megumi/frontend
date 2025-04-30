import React from 'react';
import style from './Navbar.module.css';

function Navbar({ toggleSidebar }) {
  return (
    <nav className="bg-white shadow-sm">
      <div className="px-6 py-4 flex items-center">
        <button onClick={toggleSidebar} className="mr-4 text-gray-600 hover:text-blue-600">
          <i className="fas fa-bars text-xl"></i>
        </button>
        <span className="text-gray-400 mx-2">|</span>
        <div className="breadcrumbs flex items-center text-sm">
          <span className="breadcrumb-item">Dashboard</span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="breadcrumb-item">RBAC</span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="breadcrumb-item">User Management</span>
        </div>
        <div className={style.avatar}>
          <img
            src="../../../../public/xiaoba.svg"
            alt="Profile"
            //onClick={}
          />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
