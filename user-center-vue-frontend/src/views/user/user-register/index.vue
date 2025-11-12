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
            <Index />
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { UserOutlined, LockOutlined, FieldNumberOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import Index from "@components/global/footer/index.vue";
import { userRegister } from "@/api/user.ts";
import { ROUTER_CONSTANTS } from "@/constants/router.ts";
import { SYSTEM_LOGO, SYSTEM_TITLE, SYSTEM_SUBTITLE } from "@/constants/system.ts";

defineOptions({ name: "UserRegisterPage" });

const router = useRouter();

// 当前激活的标签页
const activeKey = ref("account");

// 加载状态
const loading = ref(false);

// 注册表单
const registerForm = reactive<API.UserRegisterRequest>({
    userAccount: "",
    userPassword: "",
    checkPassword: "",
    planetCode: "",
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
        // 构造注册请求参数
        const userRegisterRequest: API.UserRegisterRequest = {
            userAccount: registerForm.userAccount,
            userPassword: registerForm.userPassword,
            checkPassword: registerForm.checkPassword,
            planetCode: registerForm.planetCode,
        };
        // 调用注册接口
        const res = await userRegister(userRegisterRequest);
        if (res.code === 20000 && res.data) {
            const userId = BigInt(res.data);
            if (userId > 0n) {
                message.success("注册成功!");
                // 跳转到登录页
                router.push(ROUTER_CONSTANTS.LOGIN.path);
            } else {
                message.error("注册失败,请重试!");
            }
        } else {
            message.error(res.message || "注册失败,请重试!");
        }
    } catch (error) {
        console.error("注册异常:", error);
        message.error("注册失败,请重试!");
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.register-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-image: url("/login_bg.svg");
    background-repeat: no-repeat;
    background-size: 100% 100%;
}

.register-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 500px;
    padding: 32px;
}

.register-header {
    width: 100%;
    margin-bottom: 32px;
    text-align: center;
}

.register-header .logo-title {
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

.register-card {
    width: 90%;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
}

.footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: transparent;
}
</style>
