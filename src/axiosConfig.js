// api/axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://9.134.68.103:9999/api/v1',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;