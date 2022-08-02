import { defineConfig } from "vite";
import path from "path";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/mtip-editor/",
  server: {
    host: "0.0.0.0",
    proxy: {
      "/images/": "http://192.168.5.234:9001",
      "/api/": {
        // target: "http://192.168.9.88:7666/", // 宋欢本地
        target: "http://192.168.5.26/",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [vueJsx()],
});
