import { sendRequest } from '../axiosConfig';

// 新增权限
export const addPermission = async (loginDTO) => {
  return await sendRequest('/api/v1/admin/permissions/add', 'post', loginDTO);
};

// 删除权限
export const deletePermission = async (idDTO) => {
  return await sendRequest('/api/v1/admin/permissions/delete', 'post', idDTO);
};

// 加载权限
export const loadPermission = async (idDTO) => {
  return await sendRequest('/api/v1/admin/permissions/load', 'post', idDTO);
};

// 获取全部
export const loadAllPermissionIds = async () => {
  return await sendRequest('/admin/permissions/loadAll', 'get');
};