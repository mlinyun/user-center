/**
 * 系统常量配置
 */

// 系统 Logo
export const SYSTEM_LOGO = "/logo.svg";

// 系统标题
export const SYSTEM_TITLE = "凌云用户中心";

// 系统副标题
export const SYSTEM_SUBTITLE = "企业核心的用户中心系统，基于 Spring Boot + Vue 3 开发的全栈项目";

// GitHub 地址
export const GITHUB_URL = "https://github.com/mlinyun/user-center";

// 默认头像
export const DEFAULT_AVATAR =
    "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png";

// 登录背景图
export const LOGIN_BG = "/login_bg.svg";

// 用户角色
export const USER_ROLE = {
    USER: "user",
    ADMIN: "admin",
} as const;

// 用户状态
export const USER_STATUS = {
    NORMAL: 0, // 正常
    BANNED: 1, // 封禁
} as const;

// 性别
export const GENDER = {
    MALE: 1, // 男
    FEMALE: 0, // 女
} as const;
