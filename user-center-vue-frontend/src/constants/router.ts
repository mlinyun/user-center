// 枚举类,罗列出项目中所有页面的名字,方便在代码中引用
export const ROUTER_CONSTANTS = {
    // 欢迎页
    WELCOME: {
        path: "/welcome",
        name: "welcome",
        label: "欢迎",
        title: "欢迎",
    },
    // 个人中心
    PROFILE: {
        path: "/profile",
        name: "profile",
        label: "个人中心",
        title: "个人中心",
    },
    // 账号设置
    SETTINGS: {
        path: "/settings",
        name: "settings",
        label: "账号设置",
        title: "账号设置",
    },
    // 管理页 - 用户管理
    ADMIN_USER_MANAGE: {
        path: "/admin/user-manage",
        name: "admin-user-manage",
        label: "用户管理",
        title: "用户管理",
    },
    // 登录页面
    LOGIN: {
        path: "/user/login",
        name: "login",
        label: "登录",
        title: "登录",
    },
    // 注册页面
    REGISTER: {
        path: "/user/register",
        name: "register",
        label: "注册",
        title: "注册",
    },
    // 404 页面
    NOT_FOUND: {
        path: "/:pathMatch(.*)*",
        name: "not-found",
        label: "未找到页面",
        title: "404",
    },
} as const;

// 类型定义，便于 TypeScript 类型检查
export type RouterKey = keyof typeof ROUTER_CONSTANTS;
