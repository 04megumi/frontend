import { sendRequest } from '../axiosConfig';

// 新增权限
export const addPermission = async (loginDTO) => {
  return await sendRequest('/admin/permissions/add', 'post', loginDTO);
};

// 删除权限
export const deletePermission = async (permissionId) => {
  return await sendRequest('/admin/permissions/delete', 'post', permissionId);
};

// 加载权限
export const loadPermission = async (permissionId) => {
  return await sendRequest('/admin/permissions/load', 'post', permissionId);
};

// 获取全部
export const loadAllPermissionIds = async () => {
  return await sendRequest('/admin/permissions/loadAll', 'get');
};
