import React from 'react';

function ContextMenu({ x, y, type, id, onHide }) {
  const handleEdit = () => {
    alert(`Editing ${type} with ID ${id}`);
    onHide();
  };
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      alert(`${type} with ID ${id} deleted`);
    }
    onHide();
  };

  return (
    <div
      className="context-menu fixed bg-white shadow-md rounded-lg z-50"
      style={{ top: y, left: x }}
      onMouseLeave={onHide}
    >
      <div
        className="context-menu-item px-4 py-2 cursor-pointer hover:bg-gray-100"
        onClick={handleEdit}
      >
        <i className="fas fa-edit mr-2"></i> Edit
      </div>
      <div
        className="context-menu-item px-4 py-2 cursor-pointer hover:bg-gray-100"
        onClick={handleDelete}
      >
        <i className="fas fa-trash mr-2"></i> Delete
      </div>
    </div>
  );
}

export default ContextMenu;
