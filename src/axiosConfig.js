// api/axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://9.134.68.103:9999/api/v1',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const sendRequest = async (url, method = 'post', data = null) => {
  try {
    const response = await api[method](url, data);
    if (response.status === 200) {
      return { success: true, data: response.data };
    } else if (response.status === 401) {
      return { success: false, message: '未授权' };
    } else if (response.status === 404) {
      return { success: false, message: '请求的资源未找到' };
    } else {
      return { success: false, message: '发生未知错误' };
    }
  } catch (error) {
    console.error('请求失败:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || '网络请求失败，请稍后再试' 
    };
  }
};

export { api, sendRequest };