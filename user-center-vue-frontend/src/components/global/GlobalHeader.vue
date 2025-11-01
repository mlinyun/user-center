<template>
    <div id="global-header">
        <a-row :wrap="false" justify="space-between" align="top" :gutter="[16, 16]">
            <a-col flex="200px">
                <router-link to="/">
                    <div class="title-banner">
                        <img class="logo" src="" alt="logo" />
                        <div class="title">用户中心</div>
                    </div>
                </router-link>
            </a-col>
            <a-col flex="auto">
                <a-menu
                    v-model:selectedKeys="current"
                    mode="horizontal"
                    :items="menuItems"
                    class="custom-menu"
                    @click="doMenuClick"
                />
            </a-col>
            <a-col flex="200px">
                <div class="user-login-status">
                    <div v-if="loginUserStore.loginUser.id">
                        {{ loginUserStore.loginUser.userName ?? "无名" }}
                    </div>
                    <div v-else>
                        <a-button type="primary" href="/user/login">登录</a-button>
                    </div>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script setup lang="ts">
import { computed, h, ref } from "vue";
import { EllipsisOutlined, HomeOutlined, InfoCircleOutlined } from "@ant-design/icons-vue";
import type { MenuProps } from "ant-design-vue";
import type { FunctionalComponent } from "vue";
import { ROUTER_CONSTANTS } from "@/constants/router";
import { useRouter } from "vue-router";
import { routes } from "@/router/routes";
import useLoginUserStore from "@/stores/modules/useLoginUserStore";

const router = useRouter();
const loginUserStore = useLoginUserStore();

// 当前选中的菜单项
const current = ref<string[]>([]);

// 监听路由变化，更新当前选中的菜单项
router.afterEach((to) => {
    current.value = [to.path];
});

// 菜单项点击事件处理
const doMenuClick = ({ key }: { key: string }) => {
    router.push({
        path: key,
    });
};

// 图标映射表
const iconMap: Record<string, FunctionalComponent> = {
    home: HomeOutlined,
    about: InfoCircleOutlined,
    other: EllipsisOutlined,
};

// TODO: 通过路由配置自动生成菜单项
const menuItems = computed<MenuProps["items"]>(() => {
    // 过滤掉不需要显示在菜单中的路由
    const visibleRoutes = routes.filter((route) => {
        // 检查 meta.hideInMenu 属性，如果为 true 则不显示
        if (route.meta?.hideInMenu === true) {
            return false;
        }

        // 继续过滤掉通配符路由（如 404 页面）
        if (route.path.includes("*")) {
            return false;
        }

        return true;
    });

    return visibleRoutes
        .map((route) => {
            const routerConst = Object.values(ROUTER_CONSTANTS).find((r) => r.path === route.path);
            if (!routerConst) return null;

            const icon = iconMap[routerConst.name] || EllipsisOutlined;

            return {
                key: routerConst.path,
                icon: () => h(icon),
                label: routerConst.label,
                title: routerConst.name,
            };
        })
        .filter(Boolean); // 过滤掉可能的 null 值
});
</script>

<style scoped>
#global-header .title-banner {
    display: flex;
    justify-content: center;
    align-items: center;
}

#global-header .title-banner .logo {
    width: 54px;
    height: 54px;
    margin-right: 16px;
}

#global-header .title-banner .title {
    position: relative;
    background: linear-gradient(120deg, #1890ff, #36cfc9);
    -webkit-background-clip: text;
    background-clip: text;
    color: #1890ff;
    font-size: 20px;
    font-weight: 600;
    text-shadow: 0 2px 4px rgb(24 144 255 / 0.1);
    letter-spacing: 0.5px;
    -webkit-text-fill-color: transparent;
}

#global-header .title-banner .title::after {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(120deg, #1890ff, #36cfc9);
    transition: transform 0.3s ease;
    transform: scaleX(0);
    content: "";
}

#global-header .title-banner .title:hover::after {
    transform: scaleX(1);
}

/* 顶部导航菜单样式 */
:deep(.custom-menu) {
    display: flex;
    justify-content: start;
    align-items: center;
    height: 63px;
    border-bottom: none;
    background: transparent;

    .ant-menu-item {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        margin: 0 8px;
        padding: 0 16px;

        &::after {
            right: 0;
            left: 0;
            width: 100%;
            transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            transform: scaleX(0);
        }

        &:hover::after,
        &.ant-menu-item-selected::after {
            transform: scaleX(1);
        }
    }
}
</style>
