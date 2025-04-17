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