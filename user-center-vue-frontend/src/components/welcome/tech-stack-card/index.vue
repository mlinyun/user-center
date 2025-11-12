<template>
    <a-card
        :bordered="true"
        hoverable
        class="tech-stack-card"
        :style="{ borderLeft: `4px solid ${color}` }"
    >
        <a-typography-title :level="5" class="stack-title">
            {{ title }}
        </a-typography-title>
        <div class="technologies">
            <a-tag v-for="tech in technologies" :key="tech">
                {{ tech }}
            </a-tag>
        </div>
    </a-card>
</template>

<script setup lang="ts">
defineOptions({ name: "TechStackCard" });

/**
 * 技术栈卡片组件
 */
defineProps<{
    title: string;
    technologies: string[];
    color: string;
}>();
</script>

<style scoped>
.tech-stack-card {
    background: transparent;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.tech-stack-card :deep(.ant-card-body) {
    padding: 20px;
}

.tech-stack-card:hover {
    box-shadow: 0 4px 16px rgb(0 0 0 / 10%);
}

.stack-title {
    margin-bottom: 16px !important;
}

.technologies {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
</style>
