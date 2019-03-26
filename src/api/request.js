import axios from 'axios';

const defaultAxios = axios.create();

// 响应拦截器
defaultAxios.interceptors.response.use(
  res => {
    return res.data;
  },
  err => {
    return Promise.reject(err);
  }
);

export default (url, data, method = 'GET', config = {}) => {
  if (!url) return Promise.reject('url is necessary');
  config.url = url;
  config.method = method;
  if (method.toUpperCase() === 'GET') {
    config.params = data;
  } else {
    config.data = data;
  }
  return defaultAxios.request(config);
};
