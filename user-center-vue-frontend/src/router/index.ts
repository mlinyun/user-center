/**
 * Vue Router 配置和权限守卫
 *
 * 主要职责：
 * 1. 创建 Vue Router 实例
 * 2. 实现权限校验守卫
 * 3. 提供权限检查和导航控制
 *
 * 权限体系：
 * - 认证权限 (Authentication)：用户是否已登录
 * - 访问权限 (Authorization)：用户是否有权访问该资源
 */

import {
    createRouter,
    createWebHistory,
    type RouteLocationNormalized,
    type NavigationGuardNext,
} from "vue-router";
import { routes } from "@/router/routes";
import { ROUTER_CONSTANTS } from "@/constants/router";
import useLoginUserStore from "@/stores/modules/useLoginUserStore";
import { message } from "ant-design-vue";

/**
 * 创建路由实例
 */
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

/**
 * 权限校验守卫
 *
 * 执行流程：
 * 1. 检查用户是否已加载（从 App.vue 的初始化）
 * 2. 验证用户是否有权限访问目标路由
 * 3. 处理权限不足或需要重定向的情况
 * 4. 放行或拒绝导航
 *
 * 重要说明：
 * - 用户信息已在 App.vue 初始化时通过 fetchLoginUser() 获取
 * - 本守卫只进行权限检查，不重复获取用户信息，避免不必要的 API 调用
 *
 * @param to - 目标路由
 * @param from - 来源路由
 * @param next - 下一步函数
 */
router.beforeEach(
    async (
        to: RouteLocationNormalized,
        from: RouteLocationNormalized,
        next: NavigationGuardNext
    ): Promise<void> => {
        try {
            const loginUserStore = useLoginUserStore();

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // Step 1: 检查用户登录状态
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 说明：用户信息已在 App.vue 初始化时获取，这里直接使用内存数据
            const isUserLoggedIn = loginUserStore.isLoggedIn();
            const loginUser = loginUserStore.loginUser;

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // Step 2: 检查认证权限 (requiresAuth)
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 检查路由是否标记为需要登录

            const requiresAuth = to.matched.some((record) => record.meta.requiresAuth === true);

            if (requiresAuth && !isUserLoggedIn) {
                // 用户未登录但该路由需要认证，重定向到登录页
                message.warning("请先登录");
                next({
                    path: ROUTER_CONSTANTS.LOGIN.path,
                    query: { redirect: to.fullPath },
                });
                return;
            }

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // Step 3: 检查管理员权限 (requiresAdmin)
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 检查路由是否标记为需要管理员权限

            const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin === true);

            if (requiresAdmin && isUserLoggedIn) {
                // 只有在用户已登录的情况下才检查管理员权限
                const userRole = loginUser.userRole;

                if (userRole !== "admin") {
                    // 用户不是管理员，拒绝访问该路由
                    message.error("您没有权限访问该页面");
                    next({ path: ROUTER_CONSTANTS.WELCOME.path });
                    return;
                }
            }

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // Step 4: 防止已登录用户访问登录页
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 如果用户已登录但尝试访问登录页，重定向到首页

            if (isUserLoggedIn && to.path === ROUTER_CONSTANTS.LOGIN.path) {
                next({ path: ROUTER_CONSTANTS.WELCOME.path });
                return;
            }

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // Step 5: 放行导航
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 所有权限检查都通过，允许导航

            next();
        } catch {
            // 守卫执行过程中出现异常，为了安全起见重定向到登录页
            next({ path: ROUTER_CONSTANTS.LOGIN.path });
        }
    }
);

/**
 * 路由后置守卫
 *
 * 用于页面标题更新和用户行为日志记录
 */
router.afterEach((to: RouteLocationNormalized): void => {
    // 更新浏览器标签页标题
    const title = to.meta?.title || "凌云用户中心";
    document.title = `${title} - 凌云用户中心`;
});

export default router;
