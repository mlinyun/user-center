import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import useLoginUserStore from "./stores/modules/useLoginUserStore";

const app = createApp(App);

app.use(Antd);

// 创建 Pinia 实例
const pinia = createPinia();
app.use(pinia);

/**
 * 应用初始化函数
 *
 * 职责：
 * 1. 在应用启动时获取登录用户信息
 * 2. 恢复用户会话（从浏览器 Cookie 中恢复）
 * 3. 为路由守卫提供可用的用户数据
 * 4. 避免路由导航时的竞态条件
 *
 * 关键点：
 * - 这个函数在应用挂载前执行
 * - 确保路由守卫执行时，用户信息已加载
 * - 即使初始化失败，应用仍继续启动（路由守卫会处理）
 *
 * @returns {Promise<void>}
 */
async function initializeApp(): Promise<void> {
    try {
        console.info("[应用初始化] 开始恢复用户会话...");

        // 获取 Store 实例
        const loginUserStore = useLoginUserStore();

        // 调用 API 获取当前登录用户信息
        // 浏览器会自动附加 Cookie (JSESSIONID)，后端根据 Session 识别用户
        const success = await loginUserStore.fetchLoginUser();

        if (success) {
            console.info(`[应用初始化] ✅ 用户会话恢复成功: ${loginUserStore.loginUser.userName}`);
        } else {
            console.info("[应用初始化] ℹ️ 用户未登录或会话已过期");
        }
    } catch (error) {
        // 初始化异常不应阻止应用启动
        // 路由守卫会处理未登录状态并重定向到登录页
        console.error("[应用初始化] ❌ 异常:", error);
    }
}

/**
 * 主程序入口
 */
(async () => {
    // Step 1: 初始化应用状态（获取用户信息）
    await initializeApp();

    // Step 2: 安装路由
    app.use(router);

    // Step 3: 挂载应用
    app.mount("#app");

    console.info("[应用启动] ✅ 应用已成功启动");
})();
