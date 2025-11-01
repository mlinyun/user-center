<template>
    <div class="register-page">
        <div class="register-container">
            <div class="register-header">
                <div class="logo-title">
                    <img class="logo" :src="SYSTEM_LOGO" alt="logo" />
                    <h1 class="title">{{ SYSTEM_TITLE }}</h1>
                </div>
                <p class="subtitle">{{ SYSTEM_SUBTITLE }}</p>
            </div>

            <a-card class="register-card" :bordered="false">
                <a-tabs v-model:activeKey="activeKey" centered>
                    <a-tab-pane key="account" tab="账号密码注册">
                        <a-form
                            :model="registerForm"
                            :rules="registerRules"
                            @finish="handleRegister"
                            layout="vertical"
                        >
                            <a-form-item name="userAccount">
                                <a-input
                                    v-model:value="registerForm.userAccount"
                                    size="large"
                                    placeholder="请输入注册账号"
                                >
                                    <template #prefix>
                                        <UserOutlined />
                                    </template>
                                </a-input>
                            </a-form-item>

                            <a-form-item name="planetCode">
                                <a-input
                                    v-model:value="registerForm.planetCode"
                                    size="large"
                                    placeholder="请输入星球编号"
                                >
                                    <template #prefix>
                                        <FieldNumberOutlined />
                                    </template>
                                </a-input>
                            </a-form-item>

                            <a-form-item name="userPassword">
                                <a-input-password
                                    v-model:value="registerForm.userPassword"
                                    size="large"
                                    placeholder="请输入密码"
                                >
                                    <template #prefix>
                                        <LockOutlined />
                                    </template>
                                </a-input-password>
                            </a-form-item>

                            <a-form-item name="checkPassword">
                                <a-input-password
                                    v-model:value="registerForm.checkPassword"
                                    size="large"
                                    placeholder="请再次输入密码"
                                >
                                    <template #prefix>
                                        <LockOutlined />
                                    </template>
                                </a-input-password>
                            </a-form-item>

                            <a-form-item>
                                <a-button
                                    type="primary"
                                    html-type="submit"
                                    size="large"
                                    :loading="loading"
                                    block
                                >
                                    注册
                                </a-button>
                            </a-form-item>

                            <a-form-item>
                                <a-space :style="{ width: '100%', justifyContent: 'center' }">
                                    <span>已有账号?</span>
                                    <router-link :to="ROUTER_CONSTANTS.LOGIN.path">
                                        立即登录
                                    </router-link>
                                </a-space>
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
import { useRouter } from "vue-router";
import { UserOutlined, LockOutlined, FieldNumberOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import GlobalFooter from "@/components/global/GlobalFooter.vue";
import { userRegister } from "@/api/userController";
import { ROUTER_CONSTANTS } from "@/constants/router";
import { SYSTEM_LOGO, SYSTEM_TITLE, SYSTEM_SUBTITLE } from "@/constants/system.ts";

const router = useRouter();

// 当前激活的标签页
const activeKey = ref("account");

// 加载状态
const loading = ref(false);

// 注册表单
const registerForm = reactive({
    userAccount: "",
    planetCode: "",
    userPassword: "",
    checkPassword: "",
});

// 自定义验证器 - 确认密码
const validateCheckPassword = async (_rule: Rule, value: string) => {
    if (!value) {
        return Promise.reject("请再次输入密码!");
    }
    if (value !== registerForm.userPassword) {
        return Promise.reject("两次输入的密码不一致!");
    }
    return Promise.resolve();
};

// 表单验证规则
const registerRules: Record<string, Rule[]> = {
    userAccount: [
        { required: true, message: "注册账号是必填项!", trigger: "blur" },
        { min: 4, message: "账号长度不小于 4 位!", trigger: "blur" },
        { max: 16, message: "账号长度不大于 16 位!", trigger: "blur" },
    ],
    planetCode: [
        { required: true, message: "星球编号是必填项!", trigger: "blur" },
        { min: 1, message: "星球编号长度不小于 1 位!", trigger: "blur" },
        { max: 20, message: "星球编号长度不大于 20 位!", trigger: "blur" },
    ],
    userPassword: [
        { required: true, message: "密码是必填项!", trigger: "blur" },
        { min: 8, message: "密码长度不小于 8 位!", trigger: "blur" },
        { max: 16, message: "密码长度不大于 16 位!", trigger: "blur" },
    ],
    checkPassword: [
        { required: true, message: "请再次输入密码!", trigger: "blur" },
        { validator: validateCheckPassword, trigger: "blur" },
    ],
};

// 处理注册
const handleRegister = async () => {
    loading.value = true;
    try {
        const res = await userRegister({
            userAccount: registerForm.userAccount,
            userPassword: registerForm.userPassword,
            checkPassword: registerForm.checkPassword,
            planetCode: registerForm.planetCode,
        });

        if (res.data.code === 0 && res.data.data) {
            const userId = BigInt(res.data.data);
            if (userId > 0n) {
                message.success("注册成功!");
                // 跳转到登录页
                router.push(ROUTER_CONSTANTS.LOGIN.path);
            } else {
                message.error("注册失败,请重试!");
            }
        } else {
            message.error(res.data.message || "注册失败,请重试!");
        }
    } catch (error) {
        console.error("注册错误:", error);
        message.error("注册失败,请重试!");
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.register-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-image: url("/login_bg.svg");
    background-size: 100% 100%;
    background-repeat: no-repeat;
}

.register-container {
    width: 100%;
    max-width: 500px;
    padding: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.register-header {
    text-align: center;
    margin-bottom: 32px;
    width: 100%;
}

.register-header .logo-title {
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

.register-card {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    width: 90%;
}

.footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: transparent;
}
</style>
