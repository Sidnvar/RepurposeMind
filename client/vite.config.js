import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// 多页面（MPA）配置：index.html 是正式前端，index_dev.html 是开发调试页。
// 开发时两个页面都是独立路由：
//   http://localhost:5173/          -> React 工作台
//   http://localhost:5173/index_dev.html -> 中文开发调试页
export default defineConfig({
  plugins: [react()],
  appType: "mpa",
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3001"
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        dev: fileURLToPath(new URL("./index_dev.html", import.meta.url))
      }
    }
  }
});
