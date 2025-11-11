<template>
    <div class="profile-page">
        <a-spin :spinning="loading" tip="加载中...">
            <a-row :gutter="[24, 24]" style="align-items: stretch">
                <!-- 左侧：用户基本信息卡片 -->
                <a-col :xs="24" :md="8" style="display: flex">
                    <a-card :bordered="true" class="user-info-card">
                        <!-- 用户头像 -->
                        <div class="avatar-wrapper">
                            <a-avatar :size="120" :src="userInfo?.userAvatar">
                                <template #icon>
                                    <UserOutlined />
                                </template>
                            </a-avatar>
                        </div>

                        <!-- 用户名和账号 -->
                        <a-typography-title :level="3" class="user-name">
                            {{ userInfo?.userName || "未设置昵称" }}
                        </a-typography-title>
                        <a-typography-text type="secondary" class="user-account">
                            @{{ userInfo?.userAccount }}
                        </a-typography-text>

                        <!-- 角色标签 -->
                        <div class="role-wrapper">
                            <a-tag :color="userInfo?.userRole === 'admin' ? 'gold' : 'blue'">
                                {{ userInfo?.userRole === "admin" ? "管理员" : "普通用户" }}
                            </a-tag>
                        </div>

                        <!-- 用户简介 -->
                        <div v-if="userInfo?.userProfile" class="user-profile">
                            <a-typography-text type="secondary" class="profile-text">
                                {{ userInfo.userProfile }}
                            </a-typography-text>
                        </div>

                        <!-- 用户统计信息 -->
                        <div class="user-stats">
                            <!-- 用户ID -->
                            <div class="stat-item stat-item-border">
                                <div class="stat-icon">🆔</div>
                                <div class="stat-content">
                                    <a-typography-text type="secondary" class="stat-label">
                                        用户 ID
                                    </a-typography-text>
                                    <a-typography-text
                                        :copyable="true"
                                        :code="true"
                                        class="stat-value"
                                    >
                                        {{ userInfo?.id || "-" }}
                                    </a-typography-text>
                                </div>
                            </div>

                            <!-- 账号使用天数 -->
                            <div class="stat-item">
                                <div class="stat-icon">📅</div>
                                <div class="stat-content">
                                    <a-typography-text type="secondary" class="stat-label">
                                        账号使用天数
                                    </a-typography-text>
                                    <div class="days-wrapper">
                                        <span class="days-number">{{ accountDays }}</span>
                                        <span class="days-unit">天</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a-card>
                </a-col>

                <!-- 右侧：详细信息 -->
                <a-col :xs="24" :md="16" style="display: flex; flex-direction: column">
                    <!-- 账号信息 -->
                    <a-card :bordered="true" class="info-card">
                        <template #title>
                            <a-space>
                                <UserOutlined class="card-icon" />
                                <a-typography-text strong>账号信息</a-typography-text>
                            </a-space>
                        </template>
                        <a-descriptions :column="2" bordered>
                            <a-descriptions-item label="登录账号">
                                <a-typography-text :copyable="true">
                                    {{ userInfo?.userAccount || "-" }}
                                </a-typography-text>
                            </a-descriptions-item>
                            <a-descriptions-item label="用户昵称">
                                {{ userInfo?.userName || "未设置" }}
                            </a-descriptions-item>
                            <a-descriptions-item label="用户角色">
                                <a-tag :color="userInfo?.userRole === 'admin' ? 'gold' : 'blue'">
                                    {{ userInfo?.userRole === "admin" ? "管理员" : "普通用户" }}
                                </a-tag>
                            </a-descriptions-item>
                            <a-descriptions-item label="性别">
                                <GenderDisplay :gender="userInfo?.userGender" />
                            </a-descriptions-item>
                        </a-descriptions>
                    </a-card>

                    <!-- 联系方式 -->
                    <a-card :bordered="true" class="info-card">
                        <template #title>
                            <a-space>
                                <PhoneOutlined class="card-icon" />
                                <a-typography-text strong>联系方式</a-typography-text>
                            </a-space>
                        </template>
                        <a-descriptions :column="2" bordered>
                            <a-descriptions-item label="邮箱地址">
                                <a-space v-if="userInfo?.userEmail">
                                    <MailOutlined class="contact-icon" />
                                    <a-typography-text :copyable="true">
                                        {{ userInfo.userEmail }}
                                    </a-typography-text>
                                </a-space>
                                <a-typography-text v-else type="secondary"
                                    >未设置</a-typography-text
                                >
                            </a-descriptions-item>
                            <a-descriptions-item label="手机号码">
                                <a-space v-if="userInfo?.userPhone">
                                    <PhoneOutlined class="contact-icon" />
                                    <a-typography-text :copyable="true">
                                        {{ userInfo.userPhone }}
                                    </a-typography-text>
                                </a-space>
                                <a-typography-text v-else type="secondary"
                                    >未设置</a-typography-text
                                >
                            </a-descriptions-item>
                            <a-descriptions-item label="星球编号">
                                <a-typography-text
                                    v-if="userInfo?.planetCode"
                                    :copyable="true"
                                    :code="true"
                                >
                                    {{ userInfo.planetCode }}
                                </a-typography-text>
                                <a-typography-text v-else type="secondary"
                                    >未设置</a-typography-text
                                >
                            </a-descriptions-item>
                        </a-descriptions>
                    </a-card>

                    <!-- 系统信息 -->
                    <a-card :bordered="true" class="info-card">
                        <template #title>
                            <a-space>
                                <span style="font-size: 16px">⏰</span>
                                <a-typography-text strong>系统信息</a-typography-text>
                            </a-space>
                        </template>
                        <a-descriptions :column="2" bordered>
                            <a-descriptions-item label="账号创建时间">
                                {{ formatDateTime(userInfo?.createTime) }}
                            </a-descriptions-item>
                            <a-descriptions-item label="最近更新时间">
                                {{ formatDateTime(userInfo?.updateTime) }}
                            </a-descriptions-item>
                            <a-descriptions-item label="最近编辑时间" :span="2">
                                <a-typography-text v-if="userInfo?.editTime">
                                    {{ formatDateTime(userInfo.editTime) }}
                                </a-typography-text>
                                <a-typography-text v-else type="secondary"
                                    >从未编辑</a-typography-text
                                >
                            </a-descriptions-item>
                        </a-descriptions>
                    </a-card>
                </a-col>
            </a-row>
        </a-spin>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { UserOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons-vue";
import useLoginUserStore from "@/stores/modules/useLoginUserStore";
import GenderDisplay from "@/pages/user/components/GenderDisplay.vue";

const loginUserStore = useLoginUserStore();
const loading = ref(false);

// 用户信息
const userInfo = computed(() => loginUserStore.loginUser);

/**
 * 计算账号使用天数
 */
const accountDays = computed(() => {
    if (!userInfo.value?.createTime) return 0;
    const now = new Date();
    const create = new Date(userInfo.value.createTime);
    const diffTime = Math.abs(now.getTime() - create.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

/**
 * 格式化日期时间
 */
const formatDateTime = (dateTime?: string | number): string => {
    if (!dateTime) return "-";
    const date = new Date(dateTime);
    return date.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};

/**
 * 刷新用户信息
 */
const refreshUserInfo = async () => {
    loading.value = true;
    try {
        await loginUserStore.fetchLoginUser();
    } catch (error) {
        console.error("获取用户信息失败:", error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    // 如果没有用户信息，则重新获取
    if (!userInfo.value?.id) {
        refreshUserInfo();
    }
});
</script>

<style scoped>
.profile-page {
    padding: 0;
}

/* ========== 左侧用户信息卡片 ========== */
.user-info-card {
    width: 100%;
    text-align: center;
    border-radius: 12px;
}

.user-info-card :deep(.ant-card-body) {
    padding: 32px;
}

.avatar-wrapper {
    margin-bottom: 24px;
}

.avatar-wrapper :deep(.ant-avatar) {
    border: 4px solid #fff;
    box-shadow: 0 0 0 1px #d9d9d9;
}

.user-name {
    margin-bottom: 8px !important;
}

.user-account {
    font-size: 14px;
}

.role-wrapper {
    margin-top: 16px;
    margin-bottom: 24px;
}

.user-profile {
    padding: 16px;
    margin-bottom: 24px;
    background: #fafafa;
    border-radius: 8px;
}

.profile-text {
    font-size: 13px;
    line-height: 1.6;
}

/* 用户统计信息 */
.user-stats {
    padding: 20px;
    margin-top: 24px;
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 12px;
    box-shadow: 0 1px 2px rgb(0 0 0 / 3%);
}

.stat-item {
    display: flex;
    gap: 16px;
    align-items: center;
}

.stat-item-border {
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px dashed #f0f0f0;
}

.stat-icon {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    font-size: 18px;
    background: #e6f7ff;
    border-radius: 8px;
}

.stat-content {
    flex: 1;
}

.stat-label {
    display: block;
    margin-bottom: 4px;
    font-size: 12px;
}

.stat-value {
    font-family: Monaco, Consolas, monospace;
    font-size: 14px;
    font-weight: 500;
}

.days-wrapper {
    display: flex;
    gap: 4px;
    align-items: baseline;
    justify-content: center;
}

.days-number {
    font-size: 32px;
    font-weight: 700;
    line-height: 1;
    color: #1890ff;
}

.days-unit {
    font-size: 16px;
    color: rgb(0 0 0 / 45%);
}

/* ========== 右侧信息卡片 ========== */
.info-card {
    margin-bottom: 24px;
    border-radius: 12px;
}

.info-card :deep(.ant-card-body) {
    padding: 24px;
}

.card-icon {
    color: #1890ff;
}

.contact-icon {
    color: #1890ff;
}

/* ========== 响应式设计 ========== */
@media (width <= 768px) {
    .user-info-card :deep(.ant-card-body) {
        padding: 24px 16px;
    }

    .info-card :deep(.ant-card-body) {
        padding: 16px;
    }

    .days-number {
        font-size: 24px;
    }

    .days-unit {
        font-size: 14px;
    }
}
</style>
