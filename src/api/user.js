import { sendRequest } from '../axiosConfig';

// 用户登录
export const login = async (userLogInDTO) => {
  return await sendRequest('/admin/users/login', 'post', userLogInDTO);
};

// 用户详细信息（权限）接口
export const me = async (userNameDTO) => {
  return await sendRequest('/admin/users/me', 'post', userNameDTO);
};

// 用户加载信息接口
export const loadUser = async (userNameDTO) => {
  return await sendRequest('/admin/users/load', 'post', userNameDTO);
};

// jwt加载信息接口
export const jwt = async (jwtToken) => {
  return await sendRequest('/admin/users/jwt', 'post', jwtToken);
};

// 用户注册接口
export const register = async (userLogInDTO) => {
  return await sendRequest('/admin/users/register', 'post', userLogInDTO);
};

// 添加用户
export const addUser = async (userLogInDTO) => {
  return await sendRequest('/admin/users/add', 'post', userLogInDTO);
};

// 删除用户
export const deleteUser = async (userNameDTO) => {
  return await sendRequest('/admin/users/delete', 'post', userNameDTO);
};

// 修改用户
export const modifyUser = async (userLogInDTO) => {
  return await sendRequest('/admin/users/modify', 'post', userLogInDTO);
};

// 获取全部
export const loadAllUserNames = async () => {
  return await sendRequest('/admin/users/loadAll', 'get');
};