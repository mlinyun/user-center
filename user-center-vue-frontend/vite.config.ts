import { fileURLToPath, URL } from "node:url";

import { defineConfig, ProxyOptions } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), vueDevTools()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
            "@utils": fileURLToPath(new URL("./src/utils", import.meta.url)),
        },
    },
    // 配置开发服务器
    server: {
        port: 8082,
        open: true,
        proxy: {
            "/api": {
                target: "http://127.0.0.1:8100/api",
                // 修改请求头中的 Origin 字段为目标服务器地址，解决跨域问题
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            } as ProxyOptions,
        },
    },
    // 配置环境变量
    define: {
        "process.env.VITE_API_URL": JSON.stringify(process.env.VITE_API_URL || "/api"),
    },
});
