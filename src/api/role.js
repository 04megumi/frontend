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

// 新增角色
export const addRole = async (roleLoginDTO) => {
  return await sendRequest('/api/v1/admin/roles/add', 'post', roleLoginDTO);
};

// 删除角色
export const deleteRole = async (roleIdDTO) => {
  return await sendRequest('/api/v1/admin/roles/delete', 'post', roleIdDTO);
};

// 加载角色信息
export const loadRole = async (roleIdDTO) => {
  return await sendRequest('/api/v1/admin/roles/load', 'post', roleIdDTO);
};

// 获取全部
export const loadAllRoleIds = async () => {
  return await sendRequest('/admin/roles/loadAll', 'get');
};