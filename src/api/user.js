import api from '../axiosConfig';

// 通用的请求发送函数
const sendRequest = async (url, method = 'post', data = null) => {
  try {
    const response = await api[method](url, data);  // 支持 GET、POST 等方法

    if (response.status === 200) {
      return { success: true, data: response.data };  // 请求成功，返回数据
    } else if (response.status === 401) {
      return { success: false, message: '未授权' };
    } else if (response.status === 404) {
      return { success: false, message: '请求的资源未找到' };
    } else {
      return { success: false, message: '发生未知错误' };
    }

  } catch (error) {
    console.error('请求失败:', error);
    return { success: false, message: '网络请求失败，请稍后再试' };  // 网络请求失败时的返回
  }
};

// 用户登录
export const login = async (userLogInDTO) => {
  return await sendRequest('/admin/users/login', 'post', userLogInDTO);
};

// 用户详细信息（权限）接口
export const me = async (userNameDTO) => {
  return await sendRequest('/admin/users/me', 'post', userNameDTO);
};

// 用户加载信息接口
export const load = async (userNameDTO) => {
  return await sendRequest('/admin/users/load', 'post', userNameDTO);
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