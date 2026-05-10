<template>
    <div class="settings-page">
        <a-spin :spinning="loading">
            <a-row :gutter="[24, 24]">
                <!-- 用户头像 -->
                <a-col :md="12" :xs="24">
                    <a-card :bordered="true" class="card">
                        <template #title>
                            <a-space>
                                <UserOutlined class="card-icon" />
                                <span class="card-title">用户头像</span>
                            </a-space>
                        </template>
                        <div class="avatar-section">
                            <a-avatar :size="120" :src="loginUser.userAvatar">
                                <template #icon>
                                    <UserOutlined />
                                </template>
                            </a-avatar>

                            <div class="avatar-meta">
                                <a-typography-title :level="4" class="avatar-name">
                                    {{ loginUser.userName || "未设置昵称" }}
                                </a-typography-title>
                                <a-typography-text class="avatar-account" type="secondary">
                                    @{{ loginUser.userAccount || "" }}
                                </a-typography-text>
                            </div>

                            <a-upload
                                :before-upload="handleAvatarUpload"
                                :disabled="uploading"
                                :show-upload-list="false"
                                accept="image/*"
                            >
                                <a class="avatar-upload-btn">
                                    {{ uploading ? "上传中..." : "更换头像" }}
                                </a>
                            </a-upload>

                            <a-typography-text class="avatar-tip" type="secondary">
                                支持 JPG、JPEG、PNG、GIF 格式<br />大小不超过 2MB
                            </a-typography-text>
                        </div>
                    </a-card>
                </a-col>

                <!-- 基本信息 -->
                <a-col :md="12" :xs="24">
                    <a-card :bordered="true" class="card">
                        <template #title>
                            <a-space>
                                <UserOutlined class="card-icon" />
                                <span class="card-title">基本信息</span>
                            </a-space>
                        </template>
                        <a-form
                            ref="basicFormRef"
                            :label-col="{ span: 6 }"
                            :model="basicForm"
                            :rules="basicRules"
                            :wrapper-col="{ span: 18 }"
                            layout="horizontal"
                            @finish="handleBasicFinish"
                        >
                            <a-form-item label="用户昵称" name="userName">
                                <a-input
                                    v-model:value="basicForm.userName"
                                    placeholder="请输入用户昵称"
                                />
                            </a-form-item>

                            <a-form-item label="性别" name="userGender">
                                <a-radio-group v-model:value="basicForm.userGender">
                                    <a-radio :value="0">女</a-radio>
                                    <a-radio :value="1">男</a-radio>
                                    <a-radio :value="2">未知</a-radio>
                                </a-radio-group>
                            </a-form-item>

                            <a-form-item label="手机号码" name="userPhone">
                                <a-input
                                    v-model:value="basicForm.userPhone"
                                    placeholder="请输入手机号码"
                                />
                            </a-form-item>

                            <a-form-item label="邮箱地址" name="userEmail">
                                <a-input
                                    v-model:value="basicForm.userEmail"
                                    placeholder="请输入邮箱地址"
                                />
                            </a-form-item>

                            <a-form-item label="个人简介" name="userProfile">
                                <a-textarea
                                    v-model:value="basicForm.userProfile"
                                    :rows="3"
                                    placeholder="请输入个人简介"
                                />
                            </a-form-item>

                            <div class="form-submit">
                                <a-button
                                    :loading="basicSubmitting"
                                    html-type="submit"
                                    type="primary"
                                >
                                    保存修改
                                </a-button>
                            </div>
                        </a-form>
                    </a-card>
                </a-col>

                <!-- 账号安全 -->
                <a-col :md="12" :xs="24">
                    <a-card :bordered="true" class="card">
                        <template #title>
                            <a-space>
                                <SafetyOutlined class="card-icon" />
                                <span class="card-title">账号安全</span>
                            </a-space>
                        </template>

                        <div class="security-level">
                            <a-typography-title :level="5" class="security-title"
                                >安全等级</a-typography-title
                            >
                            <a-progress
                                :percent="securityInfo.score"
                                :size="100"
                                :stroke-color="securityInfo.color"
                                type="circle"
                            >
                                <template #format>
                                    <div
                                        :style="{ color: securityInfo.color }"
                                        class="progress-content"
                                    >
                                        <div class="progress-score">{{ securityInfo.score }}</div>
                                        <div class="progress-level">
                                            {{ securityInfo.levelText }}
                                        </div>
                                    </div>
                                </template>
                            </a-progress>
                        </div>

                        <a-divider />

                        <div class="security-tips">
                            <a-typography-text class="security-tip-title" strong>
                                <a-space>
                                    <CheckCircleOutlined
                                        v-if="securityInfo.score >= 80"
                                        style="color: #52c41a"
                                    />
                                    <WarningOutlined v-else style="color: #faad14" />
                                    {{
                                        securityInfo.score >= 80 ? "账号安全性良好" : "建议完善信息"
                                    }}
                                </a-space>
                            </a-typography-text>
                            <div v-if="securityInfo.tips.length" class="security-tip-tags">
                                <a-tag v-for="tip in securityInfo.tips" :key="tip" color="blue">
                                    {{ tip }}
                                </a-tag>
                            </div>
                        </div>

                        <a-divider />

                        <div class="security-status">
                            <a-typography-text class="status-label" type="secondary">
                                账号状态
                            </a-typography-text>
                            <a-space :size="8" direction="vertical" style="width: 100%">
                                <div
                                    v-for="item in accountStatus"
                                    :key="item.label"
                                    class="status-item"
                                >
                                    <span>{{ item.label }}</span>
                                    <a-tag :color="item.verified ? 'success' : 'default'">
                                        {{ item.verified ? "已验证" : "未设置" }}
                                    </a-tag>
                                </div>
                            </a-space>
                        </div>
                    </a-card>
                </a-col>

                <!-- 密码管理 -->
                <a-col :md="12" :xs="24">
                    <a-card :bordered="true" class="card">
                        <template #title>
                            <a-space>
                                <LockOutlined class="card-icon" />
                                <span class="card-title">密码管理</span>
                            </a-space>
                        </template>

                        <div class="password-alert">
                            <a-space :size="4" direction="vertical" style="width: 100%">
                                <a-typography-text
                                    strong
                                    style="font-size: 13px; color: var(--ant-color-info)"
                                >
                                    <SafetyOutlined /> 密码安全建议
                                </a-typography-text>
                                <a-typography-text class="password-tip" type="secondary">
                                    • 密码长度 8-20 位，建议包含大小写字母、数字和特殊字符
                                </a-typography-text>
                                <a-typography-text class="password-tip" type="secondary">
                                    • 不要使用生日、电话号码等容易被猜到的信息
                                </a-typography-text>
                                <a-typography-text class="password-tip" type="secondary">
                                    • 定期更换密码，不要在多个网站使用相同密码
                                </a-typography-text>
                            </a-space>
                        </div>

                        <a-divider />

                        <a-form
                            ref="passwordFormRef"
                            :label-col="{ span: 6 }"
                            :model="passwordForm"
                            :rules="passwordRules"
                            :wrapper-col="{ span: 18 }"
                            layout="horizontal"
                            @finish="handlePasswordFinish"
                        >
                            <a-form-item label="当前密码" name="rawPassword">
                                <a-input-password
                                    v-model:value="passwordForm.rawPassword"
                                    placeholder="请输入当前密码"
                                />
                            </a-form-item>

                            <a-form-item label="新密码" name="newPassword">
                                <a-input-password
                                    v-model:value="passwordForm.newPassword"
                                    placeholder="请输入新密码"
                                />
                            </a-form-item>

                            <a-form-item label="确认密码" name="checkPassword">
                                <a-input-password
                                    v-model:value="passwordForm.checkPassword"
                                    placeholder="请再次输入新密码"
                                />
                            </a-form-item>

                            <div class="form-submit">
                                <a-button
                                    :loading="passwordSubmitting"
                                    html-type="submit"
                                    type="primary"
                                >
                                    修改密码
                                </a-button>
                            </div>
                        </a-form>
                    </a-card>
                </a-col>
            </a-row>
        </a-spin>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import type { FormInstance, UploadProps } from "ant-design-vue";
import { message } from "ant-design-vue";
import {
    CheckCircleOutlined,
    LockOutlined,
    SafetyOutlined,
    UserOutlined,
    WarningOutlined,
} from "@ant-design/icons-vue";
import type { Rule } from "ant-design-vue/es/form";
import useLoginUserStore from "@/stores/modules/useLoginUserStore.ts";
import { uploadAvatar } from "@/api/file.ts";
import { updateUserInfo, updateUserPassword } from "@/api/user.ts";
import { ROUTER_CONSTANTS } from "@/constants/router.ts";

defineOptions({ name: "SettingPage" });

const router = useRouter();
const loginUserStore = useLoginUserStore();
const loginUser = computed(() => loginUserStore.loginUser);

const loading = ref(false);
const uploading = ref(false);
const basicSubmitting = ref(false);
const passwordSubmitting = ref(false);

const basicFormRef = ref<FormInstance>();
const passwordFormRef = ref<FormInstance>();

type Gender = 0 | 1 | 2;

const basicForm = reactive<{
    userName: string;
    userGender: Gender;
    userPhone: string;
    userEmail: string;
    userProfile: string;
}>({
    userName: "",
    userGender: 2,
    userPhone: "",
    userEmail: "",
    userProfile: "",
});

const passwordForm = reactive({
    rawPassword: "",
    newPassword: "",
    checkPassword: "",
});

const basicRules: Record<string, Rule[]> = {
    userName: [
        {
            max: 20,
            message: "用户昵称不能超过 20 个字符",
            trigger: ["blur", "change"],
        },
    ],
    userPhone: [
        {
            validator: (_rule, value) => {
                if (!value) {
                    return Promise.resolve();
                }
                const reg = /^1[3-9]\d{9}$/;
                return reg.test(value)
                    ? Promise.resolve()
                    : Promise.reject(new Error("手机号格式不正确"));
            },
            trigger: ["blur", "change"],
        },
    ],
    userEmail: [
        {
            type: "email",
            message: "邮箱格式不正确",
            trigger: ["blur", "change"],
        },
    ],
    userProfile: [
        {
            max: 200,
            message: "个人简介不能超过 200 个字符",
            trigger: ["blur", "change"],
        },
    ],
};

const passwordRules: Record<string, Rule[]> = {
    rawPassword: [
        { required: true, message: "请输入当前密码", trigger: "blur" },
        {
            min: 8,
            max: 20,
            message: "密码长度必须在 8-20 位之间",
            trigger: ["blur", "change"],
        },
    ],
    newPassword: [
        { required: true, message: "请输入新密码", trigger: "blur" },
        {
            min: 8,
            max: 20,
            message: "密码长度必须在 8-20 位之间",
            trigger: ["blur", "change"],
        },
    ],
    checkPassword: [
        { required: true, message: "请确认新密码", trigger: "blur" },
        {
            min: 8,
            max: 20,
            message: "密码长度必须在 8-20 位之间",
            trigger: ["blur", "change"],
        },
        {
            validator: (_rule, value) => {
                if (!value || value === passwordForm.newPassword) {
                    return Promise.resolve();
                }
                return Promise.reject(new Error("两次输入的密码不一致"));
            },
            trigger: ["blur", "change"],
        },
    ],
};

const securityInfo = computed(() => {
    const info = loginUser.value;
    let score = 20;
    const tips: string[] = [];

    if (info?.userEmail) {
        score += 20;
    } else {
        tips.push("绑定邮箱");
    }

    if (info?.userPhone) {
        score += 20;
    } else {
        tips.push("绑定手机号");
    }

    if (info?.userAvatar) {
        score += 15;
    } else {
        tips.push("上传头像");
    }

    if (info?.userProfile) {
        score += 15;
    } else {
        tips.push("完善个人简介");
    }

    if (info?.userGender !== undefined && info?.userGender !== 2) {
        score += 10;
    } else {
        tips.push("设置性别");
    }

    if (score > 100) {
        score = 100;
    }

    let levelText = "较低";
    let color = "#ff4d4f";

    if (score >= 80) {
        levelText = "高";
        color = "#52c41a";
    } else if (score >= 50) {
        levelText = "中等";
        color = "#faad14";
    }

    return {
        score,
        levelText,
        color,
        tips,
    };
});

const accountStatus = computed(() => [
    {
        label: "邮箱验证",
        verified: Boolean(loginUser.value.userEmail),
    },
    {
        label: "手机验证",
        verified: Boolean(loginUser.value.userPhone),
    },
]);

const syncBasicForm = () => {
    basicForm.userName = loginUser.value.userName || "";
    basicForm.userGender = (loginUser.value.userGender ?? 2) as Gender;
    basicForm.userPhone = loginUser.value.userPhone || "";
    basicForm.userEmail = loginUser.value.userEmail || "";
    basicForm.userProfile = loginUser.value.userProfile || "";
};

watch(
    () => loginUser.value,
    () => {
        syncBasicForm();
    },
    { immediate: true }
);

const refreshUserInfo = async () => {
    loading.value = true;
    try {
        await loginUserStore.fetchLoginUser();
    } finally {
        loading.value = false;
    }
};

const handleAvatarUpload: UploadProps["beforeUpload"] = async (file) => {
    if (!file) {
        return false;
    }

    const isImage = ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(file.type);
    if (!isImage) {
        message.error("只支持 JPG、PNG、GIF 格式的图片！");
        return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error("图片大小不能超过 2MB！");
        return false;
    }

    if (!loginUser.value.id) {
        message.error("用户信息不存在");
        return false;
    }

    uploading.value = true;
    try {
        const avatarUrl = await uploadAvatar(file as File);
        const response = await updateUserInfo({
            id: loginUser.value.id,
            userAvatar: avatarUrl,
        });

        if (response?.data) {
            message.success("头像上传成功");
            await refreshUserInfo();
        } else {
            message.error(response?.message || "头像上传失败");
        }
    } catch (error) {
        console.error("头像上传失败:", error);
        message.error("头像上传失败");
    } finally {
        uploading.value = false;
    }

    return false;
};

const handleBasicFinish = async () => {
    if (!loginUser.value.id) {
        message.error("用户信息不存在");
        return;
    }

    basicSubmitting.value = true;
    try {
        const response = await updateUserInfo({
            id: loginUser.value.id,
            userName: basicForm.userName || undefined,
            userGender: basicForm.userGender,
            userPhone: basicForm.userPhone || undefined,
            userEmail: basicForm.userEmail || undefined,
            userProfile: basicForm.userProfile || undefined,
        });

        if (response?.data) {
            message.success("基本信息更新成功");
            await refreshUserInfo();
        } else {
            message.error(response?.message || "更新失败");
        }
    } catch (error) {
        console.error("更新用户信息失败:", error);
        message.error("更新失败，请重试");
    } finally {
        basicSubmitting.value = false;
    }
};

const resetPasswordForm = () => {
    passwordForm.rawPassword = "";
    passwordForm.newPassword = "";
    passwordForm.checkPassword = "";
    passwordFormRef.value?.clearValidate?.();
};

const handlePasswordFinish = async () => {
    if (!loginUser.value.id) {
        message.error("用户信息不存在");
        return;
    }

    passwordSubmitting.value = true;
    try {
        const response = await updateUserPassword({
            id: loginUser.value.id,
            rawPassword: passwordForm.rawPassword,
            newPassword: passwordForm.newPassword,
            checkPassword: passwordForm.checkPassword,
        });

        if (response?.data) {
            message.success("密码修改成功，请重新登录");
            resetPasswordForm();
            loginUserStore.clearLoginUser();
            setTimeout(() => {
                router.push(ROUTER_CONSTANTS.LOGIN.path);
            }, 1500);
        } else {
            message.error(response?.message || "密码修改失败");
        }
    } catch (error) {
        console.error("密码修改失败:", error);
        message.error("密码修改失败，请重试");
    } finally {
        passwordSubmitting.value = false;
    }
};

onMounted(async () => {
    if (!loginUser.value.id) {
        await refreshUserInfo();
    }
});
</script>

<style scoped>
.settings-page {
    padding: 0;
}

.card {
    border-radius: 12px;
}

.card-icon {
    font-size: 16px;
    color: var(--ant-color-primary);
}

.card-title {
    font-size: 16px;
    font-weight: 600;
}

.avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px 24px;
    text-align: center;
}

.avatar-meta {
    margin: 20px 0;
}

.avatar-name {
    margin-bottom: 8px !important;
}

.avatar-account {
    font-size: 14px;
}

.avatar-upload-btn {
    display: inline-block;
    padding: 10px 32px;
    color: #fff;
    text-decoration: none;
    cursor: pointer;
    background: var(--ant-color-primary);
    border-radius: 8px;
    transition: all 0.3s;
}

.avatar-upload-btn:hover {
    color: #fff;
    box-shadow: 0 6px 16px rgb(24 144 255 / 30%);
    transform: translateY(-2px);
}

.avatar-tip {
    display: block;
    margin-top: 16px;
    font-size: 12px;
}

.form-submit {
    display: flex;
    justify-content: flex-end;
    padding-top: 16px;
}

.security-level {
    margin-bottom: 24px;
    text-align: center;
}

.security-title {
    margin-bottom: 16px !important;
}

.progress-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.progress-score {
    font-size: 20px;
    font-weight: 700;
    line-height: 1;
}

.progress-level {
    font-size: 12px;
    color: var(--ant-color-text-tertiary);
}

.security-tips {
    margin-bottom: 16px;
}

.security-tip-title {
    display: block;
    margin-bottom: 12px;
    font-size: 13px;
}

.security-tip-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.security-status {
    margin-top: 12px;
}

.status-label {
    display: block;
    margin-bottom: 12px;
    font-size: 12px;
}

.status-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
}

.password-alert {
    padding: 12px 16px;
    margin-bottom: 20px;
    background: var(--ant-color-info-bg);
    border: 1px solid var(--ant-color-info-border);
    border-radius: 8px;
}

.password-tip {
    font-size: 12px;
}

.password-tip + .password-tip {
    margin-top: 2px;
}

@media (width <= 768px) {
    .avatar-section {
        padding: 24px 16px;
    }

    .form-submit {
        justify-content: center;
    }
}
</style>
