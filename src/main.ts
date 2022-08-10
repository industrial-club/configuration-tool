import { createApp } from "vue";
import App from "./app";
import Antd from "ant-design-vue";
import inlUi from "inl-ui";
import "inl-ui/dist/style.css";
import "ant-design-vue/dist/antd.css";

createApp(App).use(Antd).use(inlUi).mount("#app");
