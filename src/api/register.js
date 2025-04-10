import api from '../axiosConfig'

// 注册接口
export const register = async (userData) => {
  try {
    // 发送 POST 请求
    const response = await api.post('/admin/register', userData);

    // 假设后端响应结构是 { code: 100000, msg: '操作成功', data: { ... } }
    if (response.data.code === 100000) {
      console.log('注册成功:', response.data.data);
    } else {
      console.error('注册失败:', response.data.msg);
    }
    return response.data;
  } catch (error) {
    console.error('请求失败:', error);
  }
};