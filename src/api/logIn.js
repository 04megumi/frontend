import api from '../axiosConfig';


// 登录接口
export const login = async (userData) => {
  try {
    const response = await api.post('/admin/login', userData);

    if (response.data.code === 100000) {
      // 登录成功，获取 token
      const token = response.data.token;
      console.log('登录成功:', token);

      localStorage.setItem('authToken', token);

      return response;  // 确保返回完整的响应
    } else {
      console.error('登录失败:', response.data.msg);
      return null;  // 如果登录失败，返回 null
    }
  } catch (error) {
    console.error('请求失败:', error);
    return null;  // 如果请求失败，返回 null
  }
};