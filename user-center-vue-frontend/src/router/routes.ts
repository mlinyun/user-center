import type { RouteRecordRaw } from "vue-router";
import { ROUTER_CONSTANTS } from "@/constants/router";

// 懒加载页面组件
const WelcomePage = () => import("@/views/welcome/index.vue");
const ProfilePage = () => import("@/views/user/profile/index.vue");
const SettingsPage = () => import("@/views/user/settings/index.vue");
const AdminUserManagePage = () => import("@/views/admin/user-manage/index.vue");
const UserLoginPage = () => import("@/views/user/user-login/index.vue");
const UserRegisterPage = () => import("@/views/user/user-register/index.vue");
const NotFoundPage = () => import("@/views/exception/404/index.vue");

/**
 * 路由配置数组
 *
 * 定义应用程序的路由路径、名称和对应的组件
 * Index 在 App.vue 中静态引入，所有路由都在其 router-view 中渲染
 *
 * @type {Array<RouteRecordRaw>} Vue Router 路由记录数组
 */
export const routes: Array<RouteRecordRaw> = [
    // 根路径重定向到欢迎页
    {
        path: "/",
        redirect: ROUTER_CONSTANTS.WELCOME.path,
    },
    // 需要布局的主要页面路由
    {
        path: ROUTER_CONSTANTS.WELCOME.path,
        name: ROUTER_CONSTANTS.WELCOME.name,
        component: WelcomePage,
        meta: {
            title: ROUTER_CONSTANTS.WELCOME.title,
            icon: "smile",
            hideInMenu: false,
            requiresAuth: false,
            layout: true, // 标记需要布局
        },
    },
    {
        path: ROUTER_CONSTANTS.PROFILE.path,
        name: ROUTER_CONSTANTS.PROFILE.name,
        component: ProfilePage,
        meta: {
            title: ROUTER_CONSTANTS.PROFILE.title,
            icon: "user",
            hideInMenu: false,
            requiresAuth: true,
            layout: true,
        },
    },
    {
        path: ROUTER_CONSTANTS.SETTINGS.path,
        name: ROUTER_CONSTANTS.SETTINGS.name,
        component: SettingsPage,
        meta: {
            title: ROUTER_CONSTANTS.SETTINGS.title,
            icon: "setting",
            hideInMenu: false,
            requiresAuth: true,
            layout: true,
        },
    },
    {
        path: ROUTER_CONSTANTS.ADMIN_USER_MANAGE.path,
        name: ROUTER_CONSTANTS.ADMIN_USER_MANAGE.name,
        component: AdminUserManagePage,
        meta: {
            title: ROUTER_CONSTANTS.ADMIN_USER_MANAGE.title,
            icon: "crown",
            hideInMenu: false,
            requiresAuth: true,
            requiresAdmin: true, // 需要管理员权限
            layout: true,
        },
    },
    // 不需要布局的路由（登录、注册页面）
    {
        path: ROUTER_CONSTANTS.LOGIN.path,
        name: ROUTER_CONSTANTS.LOGIN.name,
        component: UserLoginPage,
        meta: {
            title: ROUTER_CONSTANTS.LOGIN.title,
            hideInMenu: true,
            requiresAuth: false,
            layout: false, // 不需要布局
        },
    },
    {
        path: ROUTER_CONSTANTS.REGISTER.path,
        name: ROUTER_CONSTANTS.REGISTER.name,
        component: UserRegisterPage,
        meta: {
            title: ROUTER_CONSTANTS.REGISTER.title,
            hideInMenu: true,
            requiresAuth: false,
            layout: false, // 不需要布局
        },
    },
    // 404 页面
    {
        path: ROUTER_CONSTANTS.NOT_FOUND.path,
        name: ROUTER_CONSTANTS.NOT_FOUND.name,
        component: NotFoundPage,
        meta: {
            title: ROUTER_CONSTANTS.NOT_FOUND.title,
            hideInMenu: true,
            requiresAuth: false,
            layout: false, // 不需要布局
        },
    },
];
