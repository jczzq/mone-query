import Vue from "vue";
import axios from "axios";

const defaultAxios = axios.create();

// 响应拦截器
defaultAxios.interceptors.response.use(
  res => {
    Vue.prototype.$bus.$emit("response-success", res.data);
    return res.data;
  },
  err => {
    Vue.prototype.$bus.$emit("response-error", err);
    return Promise.reject(err);
  }
);

export default (url, data, method = "GET", config = {}) => {
  if (!url) return Promise.reject("url is necessary");
  config.url = url;
  config.method = method;
  if (method.toUpperCase() === "GET") {
    config.params = data;
  } else {
    config.data = data;
  }
  return defaultAxios.request(config);
};
