import { sendRequest } from '../axiosConfig';

// 为用户添加角色
export const addUserRole = async (userRoleDTO) => {
  return await sendRequest('/api/v1/admin/users/role/add', 'post', userRoleDTO);
};

// 删除用户角色
export const deleteUserRole = async (userRoleDTO) => {
  return await sendRequest('/api/v1/admin/users/role/delete', 'post', userRoleDTO);
};