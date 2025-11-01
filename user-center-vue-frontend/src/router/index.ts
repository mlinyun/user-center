import { createRouter, createWebHistory } from "vue-router";
import { routes } from "@/router/routes";
import { ROUTER_CONSTANTS } from "@/constants/router";
import useLoginUserStore from "@/stores/modules/useLoginUserStore";
import { message } from "ant-design-vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

// 路由守卫 - 权限控制
router.beforeEach(async (to, from, next) => {
    const loginUserStore = useLoginUserStore();

    // 获取当前登录用户
    let loginUser = loginUserStore.loginUser;

    // 如果之前没有获取过登录用户信息,则自动获取
    if (!loginUser || !loginUser.id) {
        await loginUserStore.fetchLoginUser();
        loginUser = loginUserStore.loginUser;
    }

    // 检查是否需要登录
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

    // 白名单路由 - 不需要登录
    const whiteList = [
        ROUTER_CONSTANTS.LOGIN.path,
        ROUTER_CONSTANTS.REGISTER.path,
        ROUTER_CONSTANTS.WELCOME.path,
    ];

    if (requiresAuth) {
        // 需要登录但未登录
        if (!loginUser || !loginUser.id) {
            message.warning("请先登录");
            next({
                path: ROUTER_CONSTANTS.LOGIN.path,
                query: { redirect: to.fullPath }, // 记录要跳转的页面
            });
            return;
        }

        // 检查是否需要管理员权限
        const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);
        if (requiresAdmin && loginUser.userRole !== "admin") {
            message.error("您没有权限访问该页面");
            next({ path: ROUTER_CONSTANTS.WELCOME.path });
            return;
        }
    }

    // 如果已登录,访问登录页,则重定向到首页
    if (loginUser && loginUser.id && to.path === ROUTER_CONSTANTS.LOGIN.path) {
        next({ path: ROUTER_CONSTANTS.WELCOME.path });
        return;
    }

    next();
});

export default router;
