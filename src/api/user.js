import { sendRequest } from '../axiosConfig';

// 用户登录
export const login = async (userLogInDTO) => {
  return await sendRequest('/admin/users/login', 'post', userLogInDTO);
};

// 用户详细信息（权限）接口
export const me = async () => {
  return await sendRequest('/admin/users/me', 'get');
};

// 用户加载信息接口
export const loadUser = async (name) => {
  return await sendRequest('/admin/users/load', 'post', name);
};

// 用户注册接口
export const register = async (userDTO) => {
  return await sendRequest('/admin/users/register', 'post', userDTO);
};

// 添加用户
export const addUser = async (userDTO) => {
  return await sendRequest('/admin/users/add', 'post', userDTO);
};

// 删除用户
export const deleteUser = async (name) => {
  return await sendRequest('/admin/users/delete', 'post', name);
};

// 修改用户
export const modifyUser = async (userDTO) => {
  return await sendRequest('/admin/users/modify', 'post', userDTO);
};

// 获取全部
export const loadAllUserNames = async () => {
  return await sendRequest('/admin/users/loadAll', 'get');
};

// 服务器监控
export const monitor = async () => {
  return await sendRequest('/admin/users/monitor', 'get');
};
