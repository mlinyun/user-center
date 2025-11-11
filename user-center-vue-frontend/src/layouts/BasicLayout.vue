<template>
    <a-layout
        class="basic-layout"
        :style="{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }"
    >
        <!-- 顶部导航栏 -->
        <GlobalHeader />

        <!-- 主体内容区 -->
        <a-layout :style="{ flex: 1, display: 'flex' }">
            <!-- 侧边菜单栏 -->
            <GlobalSidebar />

            <!-- 主内容区 -->
            <a-layout-content class="main-content">
                <div class="content-wrapper">
                    <!-- 页面路由内容 -->
                    <router-view />
                </div>

                <!-- 页脚（放在主内容区内） -->
                <GlobalFooter />
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script setup lang="ts">
import GlobalHeader from "@/components/global/GlobalHeader.vue";
import GlobalSidebar from "@/components/global/GlobalSidebar.vue";
import GlobalFooter from "@/components/global/GlobalFooter.vue";
</script>

<style scoped>
.basic-layout {
    min-height: 100vh;
    background: #f5f5f5;
}

.main-content {
    /* 减去顶部导航栏高度 */
    height: calc(100vh - 64px);
    overflow-y: auto;
    background: #f5f5f5;
}

.content-wrapper {
    padding: 32px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
}

/* 覆盖全局页脚背景颜色 */
.global-footer {
    background: white;
}

/* 响应式设计 */
@media (width <= 768px) {
    .main-content {
        padding: 16px;
    }

    .content-wrapper {
        padding: 16px;
        margin-bottom: 12px;
    }
}

@media (width <= 480px) {
    .main-content {
        padding: 12px;
    }

    .content-wrapper {
        padding: 12px;
    }
}
</style>
