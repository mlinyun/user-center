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
import BasicLayout from "./layouts/BasicLayout.vue";
import useLoginUserStore from "./stores/modules/useLoginUserStore";

dayjs.locale("zh-cn");

const locale = zhCN;
const route = useRoute();

const loginUserStore = useLoginUserStore();
loginUserStore.fetchLoginUser();

// 根据路由 meta.layout 判断是否显示布局
// 默认为 true，除非明确设置为 false（登录、注册页面）
const showLayout = computed(() => {
    return route.meta?.layout !== false;
});
</script>

<style scoped></style>
