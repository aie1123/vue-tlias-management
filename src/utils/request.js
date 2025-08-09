import axios from "axios";
import { ElMessage } from "element-plus";
import router from "../router";

//创建axios实例对象
const request = axios.create({
  baseURL: "/api",
  timeout: 600000,
});
//axios的请求拦截器
request.interceptors.request.use(
  (config) => {
    //发送请求前做点什么
    //解析：字符串-->对象
    let loginUser = JSON.parse(localStorage.getItem("loginUser"));
    if (loginUser && loginUser.token) {
      config.headers.token = loginUser.token;
    }
    return config;
  },
  (error) => {
    //对请求错误做点什么
    return Promise.reject(error);
  }
);

//axios的响应拦截器
request.interceptors.response.use(
  (request) => {
    //成功回调
    return request.data;
  },
  (error) => {
    //失败回调
    if (error.response.status == 401) {
      //跳转登录
      ElMessage.error("登录失效，请重新登录！");
      router.push("/login");
    } else {
      ElMessage.error("系统异常，请联系管理员");
    }
    return Promise.reject(error);
  }
);

export default request;
