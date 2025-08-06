import axios from "axios";

//创建axios实例对象
const request = axios.create({
  baseURL: "/api",
  timeout: 600000,
});

//axios的响应拦截器
request.interceptors.response.use(
  (request) => {
    //成功回调
    return request.data;
  },
  (error) => {
    //失败回调
    return Promise.reject(error);
  }
);

export default request;
