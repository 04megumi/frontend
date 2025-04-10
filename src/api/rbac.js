import axios from 'axios';
import { register } from './register';

// 获取用户信息接口，后端根据 JWT 解密并返回用户信息
export const userMe = async (jwt) => {
  try {
    // 将 JWT 发送到后端获取用户信息
    const response = await axios.get('/admin/users/me', {
      headers: {
        Authorization: `Bearer ${jwt}`, // 将 JWT 作为 Authorization 头部传给后台
      }
    });

    return response.data; // 假设返回的数据是用户的详细信息
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error; // 抛出错误以供后续处理
  }
};

// 增加用户接口
export const addUser = async (userData) => {
  try {
    const response = await register(userData); // 调用注册接口
    if (response.data.code === 100000) {
      console.log('用户添加成功:', response.data.data);
      return response.data; // 返回注册成功的响应
    } else {
      console.error('用户添加失败:', response.data.msg);
      throw new Error(response.data.msg); // 根据后端返回的消息抛出错误
    }
  } catch (error) {
    console.error('用户添加失败:', error);
    throw error; // 将错误抛出，供调用者处理
  }
};

// 删除用户接口
export const deleteUser = async (name) => {
  try {
    // 发送 DELETE 请求来删除指定的用户
    const response = await axios.delete(`/users/delete/${name}`);
    
    // 检查返回的响应
    if (response.data.code === 100000) {
      console.log('用户删除成功:', response.data.data);
      return response.data; // 返回删除成功的信息
    } else {
      console.error('删除用户失败:', response.data.msg);
      throw new Error(response.data.msg); // 根据后端返回的消息抛出错误
    }
  } catch (error) {
    console.error('删除用户失败:', error);
    throw error; // 将错误抛出，供调用者处理
  }
};