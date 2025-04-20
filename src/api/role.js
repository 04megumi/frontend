import { sendRequest } from '../axiosConfig';

// 新增角色
export const addRole = async (roleLoginDTO) => {
  return await sendRequest('/admin/roles/add', 'post', roleLoginDTO);
};

// 删除角色
export const deleteRole = async (roleIdDTO) => {
  return await sendRequest('/admin/roles/delete', 'post', roleIdDTO);
};

// 加载角色信息
export const loadRole = async (roleIdDTO) => {
  return await sendRequest('/admin/roles/load', 'post', roleIdDTO);
};

// 获取全部
export const loadAllRoleIds = async () => {
  return await sendRequest('/admin/roles/loadAll', 'get');
};