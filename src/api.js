import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7050/api', // سيستخدم ال proxy تلقائياً
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// إضافة interceptor للتعامل مع التوكن
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// interceptor للتعامل مع الأخطاء
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;