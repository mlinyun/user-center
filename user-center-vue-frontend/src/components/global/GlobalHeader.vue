<template>
    <a-layout-header class="global-header">
        <div class="header-content">
            <!-- Logo 和标题 -->
            <div class="logo-section">
                <router-link to="/welcome" class="logo-link">
                    <img class="logo" :src="SYSTEM_LOGO" alt="logo" />
                    <span class="title">{{ SYSTEM_TITLE }}</span>
                </router-link>
            </div>

            <!-- 右侧用户信息和操作 -->
            <div class="user-section">
                <a-space :size="24">
                    <!-- GitHub 链接 -->
                    <a-tooltip title="GitHub">
                        <a :href="GITHUB_URL" target="_blank" rel="noopener noreferrer">
                            <GithubOutlined class="icon-link" />
                        </a>
                    </a-tooltip>

                    <!-- 用户头像下拉菜单（已登录） -->
                    <a-dropdown v-if="loginUser.id" trigger="click">
                        <template #default>
                            <div class="user-info">
                                <a-avatar
                                    :src="loginUser.userAvatar || DEFAULT_AVATAR"
                                    size="normal"
                                />
                                <span class="user-name">{{ loginUser.userName || "用户" }}</span>
                                <DownOutlined class="dropdown-icon" />
                            </div>
                        </template>
                        <template #overlay>
                            <a-menu @click="handleUserMenuClick">
                                <a-menu-item key="profile">
                                    <template #icon>
                                        <UserOutlined />
                                    </template>
                                    <span>个人中心</span>
                                </a-menu-item>
                                <a-menu-item key="settings">
                                    <template #icon>
                                        <SettingOutlined />
                                    </template>
                                    <span>账号设置</span>
                                </a-menu-item>
                                <a-divider style="margin: 8px 0" />
                                <a-menu-item key="logout">
                                    <template #icon>
                                        <LogoutOutlined />
                                    </template>
                                    <span>退出登录</span>
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>

                    <!-- 未登录状态（显示登录和注册按钮） -->
                    <a-space v-else :size="12">
                        <a-button type="default" @click="goToLogin">登录</a-button>
                        <a-button type="primary" @click="goToRegister">注册</a-button>
                    </a-space>
                </a-space>
            </div>
        </div>
    </a-layout-header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import {
    GithubOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    DownOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import useLoginUserStore from "@/stores/modules/useLoginUserStore";
import { ROUTER_CONSTANTS } from "@/constants/router";
import { SYSTEM_LOGO, SYSTEM_TITLE, GITHUB_URL, DEFAULT_AVATAR } from "@/constants/system";

const router = useRouter();
const loginUserStore = useLoginUserStore();

// 获取登录用户信息
const loginUser = computed(() => loginUserStore.loginUser);

/**
 * 处理用户菜单点击事件
 */
const handleUserMenuClick = async ({ key }: { key: string }) => {
    switch (key) {
        case "profile":
            await router.push(ROUTER_CONSTANTS.PROFILE.path);
            break;
        case "settings":
            await router.push(ROUTER_CONSTANTS.SETTINGS.path);
            break;
        case "logout":
            await handleLogout();
            break;
        default:
            break;
    }
};

/**
 * 处理退出登录
 */
const handleLogout = async () => {
    const success = await loginUserStore.doLogout();
    if (success) {
        message.success("退出登录成功");
        await router.push(ROUTER_CONSTANTS.LOGIN.path);
    } else {
        message.error("退出登录失败");
    }
};

/**
 * 跳转到登录页
 */
const goToLogin = async () => {
    await router.push(ROUTER_CONSTANTS.LOGIN.path);
};

/**
 * 跳转到注册页
 */
const goToRegister = async () => {
    await router.push(ROUTER_CONSTANTS.REGISTER.path);
};
</script>

<style scoped>
.global-header {
    position: sticky;
    top: 0;
    z-index: 999;
    height: 64px;
    padding: 0;
    line-height: 64px;
    background: rgb(255 255 255 / 80%);
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
}

.header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 100%;
    height: 100%;
    padding: 0 24px;
}

.logo-section {
    display: flex;
    flex-shrink: 0;
    align-items: center;
}

.logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    transition: opacity 0.3s ease;
}

.logo-link:hover {
    opacity: 0.8;
}

.logo {
    height: 40px;
    margin-right: 12px;
}

.title {
    font-size: 18px;
    font-weight: 600;
    color: #001529;
    white-space: nowrap;
}

.user-section {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    margin-left: auto;
}

.icon-link {
    font-size: 18px;
    color: rgb(0 0 0 / 65%);
    cursor: pointer;
    transition: color 0.3s ease;
}

.icon-link:hover {
    color: #1890ff;
}

.user-info {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 0 12px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

.user-info:hover {
    background-color: rgb(0 0 0 / 4%);
}

.user-name {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    color: rgb(0 0 0 / 85%);
    white-space: nowrap;
}

.dropdown-icon {
    font-size: 12px;
    color: rgb(0 0 0 / 45%);
}

/* 响应式设计 */
@media (width <= 768px) {
    .header-content {
        padding: 0 16px;
    }

    .title {
        font-size: 16px;
    }

    .logo {
        height: 32px;
        margin-right: 8px;
    }

    .user-section :deep(.ant-space) {
        gap: 12px !important;
    }

    .user-name {
        display: none;
    }
}

@media (width <= 480px) {
    .header-content {
        padding: 0 12px;
    }

    .logo-section {
        flex-shrink: 1;
    }

    .title {
        display: none;
    }
}
</style>
