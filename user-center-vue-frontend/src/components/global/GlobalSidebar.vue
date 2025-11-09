<template>
    <a-layout-sider
        v-model:collapsed="collapsed"
        :trigger="null"
        collapsible
        theme="light"
        :width="200"
        :collapsed-width="64"
        :style="{ borderRight: '1px solid #f0f0f0' }"
    >
        <!-- 菜单 -->
        <a-menu
            v-model:selectedKeys="selectedKeys"
            mode="inline"
            :items="menuItems"
            @click="handleMenuClick"
        />

        <!-- 折叠按钮 -->
        <div class="collapse-trigger" @click="collapsed = !collapsed">
            <MenuUnfoldOutlined v-if="collapsed" />
            <MenuFoldOutlined v-else />
        </div>
    </a-layout-sider>
</template>

<script setup lang="ts">
import { computed, h, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
    SmileOutlined,
    UserOutlined,
    SettingOutlined,
    CrownOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from "@ant-design/icons-vue";
import type { MenuProps } from "ant-design-vue";
import useLoginUserStore from "@/stores/modules/useLoginUserStore";
import { routes } from "@/router/routes";

const router = useRouter();
const route = useRoute();
const loginUserStore = useLoginUserStore();

// 侧边栏折叠状态
const collapsed = ref(false);

// 当前选中的菜单项
const selectedKeys = ref<string[]>([route.path]);

// 登录用户信息
const loginUser = computed(() => loginUserStore.loginUser);

/**
 * 监听路由变化，更新选中的菜单项
 */
watch(
    () => route.path,
    (newPath) => {
        selectedKeys.value = [newPath];
    }
);

/**
 * 图标映射
 */
const iconMap: Record<string, typeof SmileOutlined> = {
    smile: SmileOutlined,
    user: UserOutlined,
    setting: SettingOutlined,
    crown: CrownOutlined,
};

/**
 * 生成菜单项
 * 从源 routes 配置中按照定义的顺序获取需要显示在菜单中的路由
 * 这样能保证菜单顺序与 routes.ts 中的定义完全一致
 *
 * @returns {MenuProps["items"]} Ant Design Vue 菜单项配置
 */
const menuItems = computed<MenuProps["items"]>(() => {
    const items: MenuProps["items"] = [];

    // 直接遍历源 routes 数组，而不是 router.getRoutes()
    // 这样可以保证顺序与 routes.ts 中的定义完全相同
    routes.forEach((route) => {
        // 过滤掉不需要显示的路由
        if (route.meta?.hideInMenu || !route.meta?.title) {
            return;
        }

        // 检查权限：如果需要admin权限但用户不是admin，则不显示
        if (route.meta?.requiresAdmin && loginUser.value.userRole !== "admin") {
            return;
        }

        // 获取图标
        const icon = route.meta?.icon ? iconMap[route.meta.icon as string] : undefined;

        items.push({
            key: route.path,
            icon: icon ? () => h(icon) : undefined,
            label: route.meta?.title || "菜单项",
        });
    });

    return items;
});

/**
 * 处理菜单项点击事件
 */
const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key);
};
</script>

<style scoped>
.collapse-trigger {
    height: 48px;
    font-size: 16px;
    line-height: 48px;
    color: rgb(0 0 0 / 85%);
    text-align: center;
    cursor: pointer;
    border-top: 1px solid #f0f0f0;
    transition: all 0.3s;
}

.collapse-trigger:hover {
    background-color: rgb(0 0 0 / 4%);
}

:deep(.ant-menu) {
    border-right: none;
}

:deep(.ant-menu-item) {
    transition: all 0.3s ease;
}

:deep(.ant-menu-item:hover) {
    color: #1890ff;
}

:deep(.ant-menu-item-selected) {
    color: #1890ff;
    background-color: rgb(24 144 255 / 10%);
}
</style>
