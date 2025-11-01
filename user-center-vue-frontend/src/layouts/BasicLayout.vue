<template>
    <div id="basic-layout">
        <a-layout class="layout" :style="{ minHeight: '100vh' }">
            <!-- 顶部导航栏 -->
            <a-layout-header class="header">
                <div class="header-content">
                    <!-- Logo 和标题 -->
                    <div class="logo-section">
                        <router-link to="/welcome">
                            <img class="logo" :src="SYSTEM_LOGO" alt="logo" />
                            <span class="title">{{ SYSTEM_TITLE }}</span>
                        </router-link>
                    </div>

                    <!-- 右侧用户信息 -->
                    <div class="user-section">
                        <a-space :size="16">
                            <a-tooltip title="GitHub">
                                <a :href="GITHUB_URL" target="_blank">
                                    <GithubOutlined :style="{ fontSize: '18px' }" />
                                </a>
                            </a-tooltip>

                            <!-- 用户头像下拉菜单 -->
                            <a-dropdown v-if="loginUser.id">
                                <div class="user-info">
                                    <a-avatar :src="loginUser.userAvatar || DEFAULT_AVATAR" />
                                    <span class="user-name">{{
                                            loginUser.userName || "用户"
                                        }}</span>
                                </div>
                                <template #overlay>
                                    <a-menu @click="handleMenuClick">
                                        <a-menu-item key="profile">
                                            <UserOutlined />
                                            个人中心
                                        </a-menu-item>
                                        <a-menu-item key="settings">
                                            <SettingOutlined />
                                            账号设置
                                        </a-menu-item>
                                        <a-menu-divider />
                                        <a-menu-item key="logout">
                                            <LogoutOutlined />
                                            退出登录
                                        </a-menu-item>
                                    </a-menu>
                                </template>
                            </a-dropdown>

                            <!-- 未登录状态 -->
                            <a-space v-else>
                                <a-button @click="goLogin">登录</a-button>
                                <a-button type="primary" @click="goRegister">注册</a-button>
                            </a-space>
                        </a-space>
                    </div>
                </div>
            </a-layout-header>

            <a-layout>
                <!-- 侧边菜单 -->
                <a-layout-sider
                    v-model:collapsed="collapsed"
                    :trigger="null"
                    collapsible
                    theme="light"
                    :style="{ borderRight: '1px solid #f0f0f0' }"
                >
                    <a-menu
                        v-model:selectedKeys="selectedKeys"
                        mode="inline"
                        :items="menuItems"
                        @click="handleMenuItemClick"
                    />
                    <div class="collapse-trigger" @click="collapsed = !collapsed">
                        <MenuUnfoldOutlined v-if="collapsed" />
                        <MenuFoldOutlined v-else />
                    </div>
                </a-layout-sider>

                <!-- 主内容区 - 渲染需要布局的页面 -->
                <a-layout-content class="content">
                    <router-view />
                </a-layout-content>
            </a-layout>

            <!-- 页脚 -->
            <a-layout-footer class="footer">
                <GlobalFooter />
            </a-layout-footer>
        </a-layout>
    </div>
</template>

<script setup lang="ts">
import { computed, h, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
    GithubOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    SmileOutlined,
    CrownOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import type { MenuProps } from "ant-design-vue";
import GlobalFooter from "@/components/global/GlobalFooter.vue";
import useLoginUserStore from "@/stores/modules/useLoginUserStore";
import { ROUTER_CONSTANTS } from "@/constants/router";
import { SYSTEM_LOGO, SYSTEM_TITLE, GITHUB_URL, DEFAULT_AVATAR } from "@/constants/system.ts";

const router = useRouter();
const route = useRoute();
const loginUserStore = useLoginUserStore();

// 侧边栏折叠状态
const collapsed = ref(false);

// 当前选中的菜单项
const selectedKeys = ref<string[]>([route.path]);

// 登录用户信息
const loginUser = computed(() => loginUserStore.loginUser);

// 监听路由变化，更新选中的菜单项
watch(
    () => route.path,
    (newPath) => {
        selectedKeys.value = [newPath];
    }
);

// 图标映射
const iconMap: Record<string, typeof SmileOutlined> = {
    smile: SmileOutlined,
    user: UserOutlined,
    setting: SettingOutlined,
    crown: CrownOutlined,
};

// 生成菜单项
const menuItems = computed<MenuProps["items"]>(() => {
    const items: MenuProps["items"] = [];

    // 从路由配置中获取需要显示在菜单中的路由
    const routeConfig = router.getRoutes();

    routeConfig.forEach((route) => {
        // 过滤掉不需要显示的路由
        if (route.meta?.hideInMenu || !route.meta?.title) {
            return;
        }

        // 检查权限
        if (route.meta?.requiresAdmin && loginUser.value.userRole !== "admin") {
            return;
        }

        const icon = route.meta?.icon ? iconMap[route.meta.icon as string] : undefined;

        items.push({
            key: route.path,
            icon: icon ? () => h(icon) : undefined,
            label: route.meta.title,
        });
    });

    return items;
});

// 菜单项点击事件
const handleMenuItemClick = ({ key }: { key: string }) => {
    router.push(key);
};

// 用户菜单点击事件
const handleMenuClick = async ({ key }: { key: string }) => {
    if (key === "logout") {
        const success = await loginUserStore.doLogout();
        if (success) {
            message.success("退出登录成功");
            router.push(ROUTER_CONSTANTS.LOGIN.path);
        } else {
            message.error("退出登录失败");
        }
    } else if (key === "profile") {
        router.push(ROUTER_CONSTANTS.PROFILE.path);
    } else if (key === "settings") {
        router.push(ROUTER_CONSTANTS.SETTINGS.path);
    }
};

// 跳转到登录页
const goLogin = () => {
    router.push(ROUTER_CONSTANTS.LOGIN.path);
};

// 跳转到注册页
const goRegister = () => {
    router.push(ROUTER_CONSTANTS.REGISTER.path);
};
</script>

<style scoped>
.header {
    background: #fff;
    padding: 0;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    position: sticky;
    top: 0;
    z-index: 999;
}

.header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 0 24px;
}

.logo-section {
    display: flex;
    align-items: center;
}

.logo-section a {
    display: flex;
    align-items: center;
    text-decoration: none;
}

.logo {
    height: 32px;
    margin-right: 12px;
}

.title {
    font-size: 18px;
    font-weight: 600;
    color: #001529;
}

.user-section {
    display: flex;
    align-items: center;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 4px 12px;
    border-radius: 4px;
    transition: background-color 0.3s;
}

.user-info:hover {
    background-color: rgba(0, 0, 0, 0.04);
}

.user-name {
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.content {
    margin: 24px;
    padding: 24px;
    background: #fff;
    min-height: 280px;
}

.footer {
    text-align: center;
    background: #f0f2f5;
}

.collapse-trigger {
    height: 48px;
    line-height: 48px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    border-top: 1px solid #f0f0f0;
}

.collapse-trigger:hover {
    background: rgba(0, 0, 0, 0.04);
}
</style>
