<template>
    <div class="login-page">
        <div class="login-container">
            <div class="login-header">
                <div class="logo-title">
                    <img class="logo" :src="SYSTEM_LOGO" alt="logo" />
                    <h1 class="title">{{ SYSTEM_TITLE }}</h1>
                </div>
                <p class="subtitle">{{ SYSTEM_SUBTITLE }}</p>
            </div>

            <a-card class="login-card" :bordered="false">
                <a-tabs v-model:activeKey="activeKey" centered>
                    <a-tab-pane key="account" tab="账号密码登录">
                        <a-form
                            :model="loginForm"
                            :rules="loginRules"
                            @finish="handleLogin"
                            layout="vertical"
                        >
                            <a-form-item name="userAccount">
                                <a-input
                                    v-model:value="loginForm.userAccount"
                                    size="large"
                                    placeholder="请输入登录账号"
                                >
                                    <template #prefix>
                                        <UserOutlined />
                                    </template>
                                </a-input>
                            </a-form-item>

                            <a-form-item name="userPassword">
                                <a-input-password
                                    v-model:value="loginForm.userPassword"
                                    size="large"
                                    placeholder="请输入登录密码"
                                >
                                    <template #prefix>
                                        <LockOutlined />
                                    </template>
                                </a-input-password>
                            </a-form-item>

                            <a-form-item>
                                <div class="login-options">
                                    <a-checkbox v-model:checked="autoLogin">自动登录</a-checkbox>
                                    <div class="center-links">
                                        <span>还没有账号?</span>
                                        <router-link :to="ROUTER_CONSTANTS.REGISTER.path">
                                            立即注册
                                        </router-link>
                                    </div>
                                    <a :href="GITHUB_URL" target="_blank">忘记密码?</a>
                                </div>
                            </a-form-item>

                            <a-form-item>
                                <a-button
                                    type="primary"
                                    html-type="submit"
                                    size="large"
                                    :loading="loading"
                                    block
                                >
                                    登录
                                </a-button>
                            </a-form-item>
                        </a-form>
                    </a-tab-pane>
                </a-tabs>
            </a-card>
        </div>

        <div class="footer">
            <GlobalFooter />
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import GlobalFooter from "@/components/global/GlobalFooter.vue";
import useLoginUserStore from "@/stores/modules/useLoginUserStore";
import { ROUTER_CONSTANTS } from "@/constants/router";
import { SYSTEM_LOGO, SYSTEM_TITLE, SYSTEM_SUBTITLE, GITHUB_URL } from "@/constants/system";

const router = useRouter();
const route = useRoute();
const loginUserStore = useLoginUserStore();

// 当前激活的标签页
const activeKey = ref("account");

// 加载状态
const loading = ref(false);

// 自动登录
const autoLogin = ref(true);

// 登录表单
const loginForm = reactive({
    userAccount: "",
    userPassword: "",
});

// 表单验证规则
const loginRules: Record<string, Rule[]> = {
    userAccount: [
        { required: true, message: "登录账号是必填项!", trigger: "blur" },
        { min: 4, message: "账号长度不小于 4 位!", trigger: "blur" },
        { max: 16, message: "账号长度不大于 16 位!", trigger: "blur" },
    ],
    userPassword: [
        { required: true, message: "登录密码是必填项!", trigger: "blur" },
        { min: 8, message: "密码长度不小于 8 位!", trigger: "blur" },
        { max: 16, message: "密码长度不大于 16 位!", trigger: "blur" },
    ],
};

// 处理登录
const handleLogin = async () => {
    loading.value = true;
    try {
        const success = await loginUserStore.doLogin(loginForm.userAccount, loginForm.userPassword);

        console.log("登录结果:", success);

        if (success) {
            message.success("登录成功!");
            // 跳转到重定向页面或首页
            const redirect = (route.query.redirect as string) || ROUTER_CONSTANTS.WELCOME.path;
            router.push(redirect);
        } else {
            message.error("登录失败,请检查账号密码!");
        }
    } catch (error) {
        console.error("登录错误:", error);
        message.error("登录失败,请重试!");
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.login-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-image: url("/login_bg.svg");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: relative;
}

.login-container {
    width: 100%;
    max-width: 500px;
    padding: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.login-header {
    text-align: center;
    margin-bottom: 32px;
    width: 100%;
}

.login-header .logo-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 12px;
}

.logo {
    width: 48px;
    height: 48px;
}

.title {
    font-size: 28px;
    font-weight: 600;
    color: #001529;
    margin: 0;
}

.subtitle {
    font-size: 14px;
    color: #666;
    margin: 0;
    line-height: 1.5;
}

.login-card {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    width: 90%;
}

.login-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.center-links {
    display: flex;
    align-items: center;
    gap: 4px;
}

.footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: transparent;
}
</style>
