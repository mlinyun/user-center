<template>
    <div class="login-page">
        <div class="login-container">
            <div class="login-header">
                <div class="logo-title">
                    <img :src="SYSTEM_LOGO" alt="logo" class="logo" />
                    <h1 class="title">{{ SYSTEM_TITLE }}</h1>
                </div>
                <p class="subtitle">{{ SYSTEM_SUBTITLE }}</p>
            </div>

            <a-card :bordered="false" class="login-card">
                <a-tabs v-model:activeKey="activeKey" centered>
                    <a-tab-pane key="account" tab="账号密码登录">
                        <a-form
                            :model="loginForm"
                            :rules="loginRules"
                            layout="vertical"
                            @finish="handleLogin"
                        >
                            <a-form-item name="userAccount">
                                <a-input
                                    v-model:value="loginForm.userAccount"
                                    placeholder="请输入登录账号"
                                    size="large"
                                >
                                    <template #prefix>
                                        <UserOutlined />
                                    </template>
                                </a-input>
                            </a-form-item>

                            <a-form-item name="userPassword">
                                <a-input-password
                                    v-model:value="loginForm.userPassword"
                                    placeholder="请输入登录密码"
                                    size="large"
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
                                    :loading="loading"
                                    block
                                    html-type="submit"
                                    size="large"
                                    type="primary"
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
            <Index />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { LockOutlined, UserOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import Index from "@components/global/footer/index.vue";
import useLoginUserStore from "@/stores/modules/useLoginUserStore.ts";
import { ROUTER_CONSTANTS } from "@/constants/router.ts";
import { GITHUB_URL, SYSTEM_LOGO, SYSTEM_SUBTITLE, SYSTEM_TITLE } from "@/constants/system.ts";

defineOptions({ name: "UserLoginPage" });

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
        const userLoginRequest: API.UserLoginRequest = {
            autoLogin: autoLogin.value,
            userAccount: loginForm.userAccount,
            userPassword: loginForm.userPassword,
        };
        const success = await loginUserStore.doLogin(userLoginRequest);
        if (success) {
            message.success("登录成功!");
            // 跳转到重定向页面或首页
            const redirect = (route.query.redirect as string) || ROUTER_CONSTANTS.WELCOME.path;
            router.push(redirect);
        } else {
            message.error("登录失败,请检查账号密码!");
        }
    } catch (error) {
        console.error("登录异常:", error);
        message.error("登录失败,请重试!");
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.login-page {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-image: url("/login_bg.svg");
    background-repeat: no-repeat;
    background-size: 100% 100%;
}

.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 500px;
    padding: 32px;
}

.login-header {
    width: 100%;
    margin-bottom: 32px;
    text-align: center;
}

.login-header .logo-title {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
}

.logo {
    width: 48px;
    height: 48px;
}

.title {
    margin: 0;
    font-size: 28px;
    font-weight: 600;
    color: #001529;
}

.subtitle {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    color: #666;
}

.login-card {
    width: 90%;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
}

.login-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.center-links {
    display: flex;
    gap: 4px;
    align-items: center;
}

.footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: transparent;
}
</style>
