import { defineConfig } from "vite";
import path from "path";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api/": {
        target: "http://192.168.9.88:7666/",
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
