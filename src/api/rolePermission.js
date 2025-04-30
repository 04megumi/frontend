import { sendRequest } from '../axiosConfig';

// 为角色添加权限
export const addRolePermission = async (rolePermissionDTO) => {
  return await sendRequest('/admin/roles/permission/add', 'post', rolePermissionDTO);
};

// 删除角色权限
export const deleteRolePermission = async (rolePermissionDTO) => {
  return await sendRequest('/admin/roles/permission/delete', 'post', rolePermissionDTO);
};
