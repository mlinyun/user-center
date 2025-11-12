<template>
    <div id="main">
        <a-config-provider :locale="locale">
            <!-- 根据路由 meta.layout 决定是否显示布局 -->
            <BasicLayout v-if="showLayout" />
            <!-- 不需要布局的页面直接渲染 -->
            <router-view v-else />
        </a-config-provider>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import BasicLayout from "./layouts/basic-layout/index.vue";

/**
 * 应用根组件 (App.vue)
 *
 * 主要职责：
 * 1. 配置国际化和日期库
 * 2. 根据路由选择是否显示布局
 *
 * 说明：
 * - 用户初始化已在 main.ts 中完成（应用启动前）
 * - 本组件只负责 UI 渲染，不处理状态初始化
 * - 避免重复调用 API 和竞态条件
 */

/**
 * 配置国际化（中文）
 */
dayjs.locale("zh-cn");

/**
 * 应用国际化配置
 */
const locale = zhCN;

/**
 * 获取当前路由信息
 */
const route = useRoute();

/**
 * 计算属性：判断是否显示布局
 *
 * 说明：某些页面（如登录、注册）不需要布局，直接渲染页面
 * 通过路由 meta.layout 字段控制
 *
 * @returns {boolean} true 显示布局，false 不显示布局
 */
const showLayout = computed(() => {
    return route.meta?.layout !== false;
});
</script>
