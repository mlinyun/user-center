<template>
    <a-modal
        :open="visible"
        title="创建新用户"
        width="720px"
        :confirm-loading="submitting"
        :ok-button-props="{ loading: submitting, disabled: uploading }"
        :mask-closable="false"
        destroy-on-close
        @cancel="handleCancel"
        @ok="handleSubmit"
    >
        <div class="modal-header-card">
            <a-space>
                <PlusOutlined class="header-icon" />
                <div class="header-text">
                    <strong>创建新用户账号</strong>
                    <span>请填写账号信息并为新用户设置初始密码</span>
                </div>
            </a-space>
        </div>

        <div class="section">
            <a-divider orientation="left">
                <a-space>
                    <IdcardOutlined />
                    <span>用户头像</span>
                </a-space>
            </a-divider>
            <div class="avatar-wrapper">
                <a-upload
                    :show-upload-list="false"
                    accept="image/*"
                    :before-upload="beforeAvatarUpload"
                    :disabled="uploading"
                >
                    <div class="avatar-upload">
                        <a-spin :spinning="uploading">
                            <a-avatar :size="120" :src="avatarUrl">
                                <template #icon>
                                    <UserOutlined />
                                </template>
                            </a-avatar>
                        </a-spin>
                        <div class="avatar-mask">
                            <CameraOutlined />
                            <span>{{ uploading ? "上传中..." : "点击上传头像" }}</span>
                        </div>
                    </div>
                </a-upload>
                <a-typography-text type="secondary" class="avatar-tip">
                    支持 JPG、PNG、GIF 格式，文件大小不超过 2MB
                </a-typography-text>
            </div>
        </div>

        <a-form
            ref="formRef"
            :model="formModel"
            :rules="rules"
            layout="horizontal"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            autocomplete="off"
        >
            <div class="section">
                <a-divider orientation="left">
                    <a-space>
                        <KeyOutlined />
                        <span>账号信息</span>
                    </a-space>
                </a-divider>
                <a-form-item label="登录账号" name="userAccount">
                    <a-input
                        v-model:value="formModel.userAccount"
                        placeholder="请输入登录账号"
                        allow-clear
                        class="rounded-input"
                    >
                        <template #prefix>
                            <UserOutlined />
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item label="星球编号" name="planetCode">
                    <a-input
                        v-model:value="formModel.planetCode"
                        placeholder="请输入星球编号"
                        allow-clear
                        class="rounded-input"
                    >
                        <template #prefix>
                            <IdcardOutlined />
                        </template>
                    </a-input>
                </a-form-item>
            </div>

            <div class="section">
                <a-divider orientation="left">
                    <a-space>
                        <LockOutlined />
                        <span>密码设置</span>
                    </a-space>
                </a-divider>
                <a-alert
                    type="info"
                    show-icon
                    class="password-alert"
                    message="密码须包含大小写字母、数字和特殊字符，长度 8-20 位"
                />
                <a-form-item label="登录密码" name="userPassword">
                    <a-input-password
                        v-model:value="formModel.userPassword"
                        placeholder="请输入登录密码"
                        allow-clear
                        class="rounded-input"
                    >
                        <template #prefix>
                            <LockOutlined />
                        </template>
                    </a-input-password>
                </a-form-item>
                <div v-if="passwordStrength > 0" class="password-strength">
                    <a-space>
                        <span>密码强度：</span>
                        <a-tag :color="passwordStrengthColor">{{ passwordStrengthText }}</a-tag>
                    </a-space>
                    <div class="strength-bar">
                        <div class="strength-fill" :style="passwordStrengthStyle"></div>
                    </div>
                </div>
                <a-form-item label="确认密码" name="checkPassword">
                    <a-input-password
                        v-model:value="formModel.checkPassword"
                        placeholder="请再次输入密码"
                        allow-clear
                        class="rounded-input"
                    >
                        <template #prefix>
                            <SafetyOutlined />
                        </template>
                    </a-input-password>
                </a-form-item>
            </div>

            <div class="section">
                <a-divider orientation="left">
                    <a-space>
                        <UserOutlined />
                        <span>基本信息</span>
                    </a-space>
                </a-divider>
                <a-form-item label="用户昵称" name="userName">
                    <a-input
                        v-model:value="formModel.userName"
                        placeholder="请输入用户昵称"
                        allow-clear
                        class="rounded-input"
                    >
                        <template #prefix>
                            <UserOutlined />
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item label="用户角色" name="userRole">
                    <a-radio-group v-model:value="formModel.userRole">
                        <a-radio value="user"> <TeamOutlined /> 普通用户 </a-radio>
                        <a-radio value="admin"> <SafetyOutlined /> 管理员 </a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="性别" name="userGender">
                    <a-radio-group v-model:value="formModel.userGender">
                        <a-radio :value="0">女</a-radio>
                        <a-radio :value="1">男</a-radio>
                        <a-radio :value="2">未知</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="手机号码" name="userPhone">
                    <a-input
                        v-model:value="formModel.userPhone"
                        placeholder="请输入手机号码"
                        allow-clear
                        class="rounded-input"
                    >
                        <template #prefix>
                            <PhoneOutlined />
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item label="邮箱地址" name="userEmail">
                    <a-input
                        v-model:value="formModel.userEmail"
                        placeholder="请输入邮箱地址"
                        allow-clear
                        class="rounded-input"
                    >
                        <template #prefix>
                            <MailOutlined />
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item label="个人简介" name="userProfile">
                    <a-textarea
                        v-model:value="formModel.userProfile"
                        :rows="3"
                        :maxlength="200"
                        show-count
                        placeholder="请输入个人简介"
                    />
                </a-form-item>
            </div>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import type { FormInstance, UploadProps } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import {
    PlusOutlined,
    IdcardOutlined,
    UserOutlined,
    LockOutlined,
    SafetyOutlined,
    PhoneOutlined,
    MailOutlined,
    TeamOutlined,
    CameraOutlined,
    KeyOutlined,
} from "@ant-design/icons-vue";
import { useUserOperations } from "@/pages/admin/hooks/useUserOperations";
import { PASSWORD_PATTERN } from "@/constants/validation";

const props = defineProps<{
    visible: boolean;
}>();

const emit = defineEmits<{
    (event: "update:visible", value: boolean): void;
    (event: "success"): void;
}>();

const { handleAdd, handleAvatarUpload: uploadAvatarHandler, uploading } = useUserOperations();

const labelCol = { span: 6 };
const wrapperCol = { span: 16 };

const defaultFormState: API.AdminAddUserRequest & { checkPassword: string } = {
    userAccount: "",
    userPassword: "",
    checkPassword: "",
    planetCode: "",
    userName: "",
    userAvatar: undefined,
    userProfile: "",
    userRole: "user",
    userGender: 2,
    userPhone: "",
    userEmail: "",
};

const formModel = reactive({ ...defaultFormState });
const formRef = ref<FormInstance>();
const submitting = ref(false);
const avatarUrl = ref<string>("");
const passwordStrength = ref(0);

const rules: Record<string, Rule[]> = {
    userAccount: [
        { required: true, message: "请输入登录账号", trigger: ["blur", "change"] },
        { min: 4, max: 16, message: "登录账号长度必须在 4-16 位之间", trigger: ["blur", "change"] },
        {
            pattern: /^\w+$/,
            message: "登录账号只能包含字母、数字和下划线",
            trigger: ["blur", "change"],
        },
    ],
    planetCode: [
        { required: true, message: "请输入星球编号", trigger: ["blur", "change"] },
        { max: 6, message: "星球编号长度不能超过 6 位", trigger: ["blur", "change"] },
    ],
    userPassword: [
        { required: true, message: "请输入登录密码", trigger: "blur" },
        { min: 8, max: 20, message: "密码长度必须在 8-20 位之间", trigger: ["blur", "change"] },
        {
            pattern: PASSWORD_PATTERN,
            message: "密码需包含大小写字母、数字和特殊字符",
            trigger: ["blur", "change"],
        },
    ],
    checkPassword: [
        { required: true, message: "请确认登录密码", trigger: "blur" },
        {
            validator: (_rule, value) => {
                if (!value || value === formModel.userPassword) {
                    return Promise.resolve();
                }
                return Promise.reject(new Error("两次输入的密码不一致"));
            },
            trigger: ["blur", "change"],
        },
    ],
    userName: [{ max: 20, message: "用户昵称不能超过 20 个字符", trigger: ["blur", "change"] }],
    userPhone: [
        {
            validator: (_rule, value) => {
                if (!value) {
                    return Promise.resolve();
                }
                return /^1[3-9]\d{9}$/.test(value)
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
        { max: 200, message: "个人简介不能超过 200 个字符", trigger: ["blur", "change"] },
    ],
};

watch(
    () => formModel.userPassword,
    (value) => {
        passwordStrength.value = calculatePasswordStrength(value);
    }
);

watch(
    () => props.visible,
    (visible) => {
        if (!visible) {
            resetForm();
        }
    }
);

const passwordStrengthColor = computed(() => {
    if (passwordStrength.value < 40) return "#ff4d4f";
    if (passwordStrength.value < 70) return "#faad14";
    return "#52c41a";
});

const passwordStrengthText = computed(() => {
    if (passwordStrength.value < 40) return "弱";
    if (passwordStrength.value < 70) return "中";
    return "强";
});

const passwordStrengthStyle = computed(() => ({
    width: `${Math.max(passwordStrength.value, 10)}%`,
    backgroundColor: passwordStrengthColor.value,
}));

const calculatePasswordStrength = (password: string): number => {
    if (!password) {
        return 0;
    }
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password)) strength += 12.5;
    if (/[A-Z]/.test(password)) strength += 12.5;
    if (/\d/.test(password)) strength += 12.5;
    if (/[~`!@#$%^&*()\-_=+[\]{}\\|;:'",<.>/?]/.test(password)) strength += 12.5;
    return Math.min(strength, 100);
};

const beforeAvatarUpload: UploadProps["beforeUpload"] = async (file) => {
    const rawFile = file as File;
    const url = await uploadAvatarHandler(rawFile);
    if (url) {
        avatarUrl.value = url;
    }
    return false;
};

const handleSubmit = async () => {
    if (submitting.value) {
        return;
    }
    try {
        submitting.value = true;
        await formRef.value?.validate();
        const payload: API.AdminAddUserRequest = {
            userAccount: formModel.userAccount.trim(),
            userPassword: formModel.userPassword,
            checkPassword: formModel.checkPassword,
            planetCode: formModel.planetCode.trim(),
            userName: formModel.userName?.trim() || undefined,
            userAvatar: avatarUrl.value || undefined,
            userProfile: formModel.userProfile?.trim() || undefined,
            userRole: formModel.userRole,
            userGender: formModel.userGender as 0 | 1 | 2,
            userPhone: formModel.userPhone?.trim() || undefined,
            userEmail: formModel.userEmail?.trim() || undefined,
        };

        const success = await handleAdd(payload);
        if (success) {
            emit("success");
            emit("update:visible", false);
            resetForm();
        }
    } finally {
        submitting.value = false;
    }
};

const handleCancel = () => {
    emit("update:visible", false);
};

const resetForm = () => {
    Object.assign(formModel, defaultFormState);
    avatarUrl.value = "";
    passwordStrength.value = 0;
    formRef.value?.resetFields();
    formRef.value?.clearValidate();
};
</script>

<style scoped>
.modal-header-card {
    padding: 16px;
    margin-bottom: 16px;
    background: linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%);
    border: 1px solid #b7eb8f;
    border-radius: 12px;
}

.header-icon {
    font-size: 24px;
    color: #389e0d;
}

.header-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 13px;
    color: rgb(0 0 0 / 65%);
}

.section {
    margin-bottom: 24px;
}

.avatar-wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    margin-top: 12px;
}

.avatar-upload {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.avatar-mask {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    color: #fff;
    background: rgb(0 0 0 / 45%);
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.avatar-upload:hover .avatar-mask {
    opacity: 1;
}

.avatar-mask span {
    margin-top: 6px;
}

.avatar-tip {
    font-size: 12px;
}

.rounded-input :deep(.ant-input),
.rounded-input :deep(.ant-input-affix-wrapper) {
    border-radius: 8px;
}

.password-alert {
    margin-bottom: 16px;
    border-radius: 8px;
}

.password-strength {
    margin: -8px 0 16px 25%;
    color: rgb(0 0 0 / 65%);
}

.strength-bar {
    height: 4px;
    margin-top: 8px;
    overflow: hidden;
    background: #f0f0f0;
    border-radius: 2px;
}

.strength-fill {
    height: 100%;
    transition:
        width 0.3s ease,
        background-color 0.3s ease;
}
</style>
