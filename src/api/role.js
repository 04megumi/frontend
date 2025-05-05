import { sendRequest } from '../axiosConfig';

// 新增角色
export const addRole = async (roleLoginDTO) => {
  return await sendRequest('/admin/roles/add', 'post', roleLoginDTO);
};

// 修改角色
export const modifyRole = async (roleLoginDTO) => {
  return await sendRequest('/admin/roles/modify', 'post', roleLoginDTO);
};

// 删除角色
export const deleteRole = async (roleId) => {
  return await sendRequest('/admin/roles/delete', 'post', roleId);
};

// 加载角色信息
export const loadRole = async (roleId) => {
  return await sendRequest('/admin/roles/load', 'post', roleId);
};

// 获取全部
export const loadAllRoleIds = async () => {
  return await sendRequest('/admin/roles/loadAll', 'get');
};