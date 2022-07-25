import axios from "axios";
import { message } from "ant-design-vue";

const instance = axios.create({
  baseURL: "/api/",
  timeout: 10000,
  headers: {
    "X-Custom-Header": "foobar",
    clientType: "app",
    "Content-Type": "application/json;charset=UTF-8",
    userId: -1,
    corpId: 123,
  },
});

const getToken = (): string => {
  return `${sessionStorage.getItem("token")}`;
};

instance.interceptors.request.use(
  (conf) => {
    return conf;
  },
  (err) => {
    return Promise.reject(err);
  }
);

instance.interceptors.response.use(
  (res) => {
    const resData = res.data;
    const status = resData.code === "M0000";
    if (resData.code === "M4003") {
      message.error("登陆已过期，请重新登陆");
      return Promise.reject(resData);
    }
    if (status) {
      return Promise.resolve(resData);
    }
    if (status && res.config.responseType !== "blob") {
      return Promise.resolve(resData);
    }
    if (resData && res.config.responseType === "blob") {
      return Promise.resolve(resData);
    }
    const msg = resData?.message ?? "请求失败";
    message.error(msg);
    return Promise.reject(resData);
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default instance;
