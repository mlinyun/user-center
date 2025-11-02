<template>
    <div class="welcome-page">
        <h1>欢迎来到凌云用户中心</h1>
        <p>页面开发中...</p>
        <p>健康检查结果：{{ checkResult }}！</p>
    </div>
</template>

<script setup lang="ts">
// 欢迎页面组件 - 待完善
import { health } from "@/api/health.ts";
import { ref } from "vue";

const checkResult = ref<string>("");

health()
    .then((res) => {
        console.log(res);
        if (res.code === 20000 && res.data) {
            checkResult.value = res.message as string;
        } else {
            checkResult.value = "健康检查失败";
        }
    })
    .catch((error) => {
        console.error("健康检查异常", error);
    });
</script>

<style scoped>
.welcome-page {
    padding: 24px;
}
</style>
