<template>
    <a-modal
        :open="visible"
        title="编辑用户信息"
        width="720px"
        :confirm-loading="submitting"
        :ok-button-props="{ disabled: !user, loading: submitting || uploading }"
        :mask-closable="false"
        destroy-on-close
        @cancel="handleCancel"
        @ok="handleSubmit"
    >
        <div v-if="user" class="modal-header-card">
            <a-space>
                <EditOutlined class="header-icon" />
                <div class="header-text">
                    <strong>账号：{{ user.userAccount }}</strong>
                    <span>创建时间：{{ formatCreateTime(user.createTime) }}</span>
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
                    :disabled="uploading || !user"
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
                            <span>{{ uploading ? "上传中..." : "点击更换头像" }}</span>
                        </div>
                    </div>
                </a-upload>
                <a-typography-text type="secondary" class="avatar-tip">
                    上传后会立即保存，刷新后生效
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

            <div class="section">
                <a-divider orientation="left">
                    <a-space>
                        <PhoneOutlined />
                        <span>联系方式</span>
                    </a-space>
                </a-divider>
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
            </div>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { computed, reactive, ref, watch } from "vue";
import type { FormInstance, UploadProps } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import {
    EditOutlined,
    IdcardOutlined,
    UserOutlined,
    TeamOutlined,
    SafetyOutlined,
    PhoneOutlined,
    MailOutlined,
    CameraOutlined,
} from "@ant-design/icons-vue";
import { USER_ROLE } from "@/constants/system";
import { useUserOperations } from "@/views/admin/hooks/useUserOperations";

const props = defineProps<{
    visible: boolean;
    user: API.User | null;
}>();

const emit = defineEmits<{
    (event: "update:visible", value: boolean): void;
    (event: "success"): void;
}>();

const labelCol = { span: 6 };
const wrapperCol = { span: 16 };

type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

const formRef = ref<FormInstance>();
const formModel = reactive({
    userName: "",
    userRole: USER_ROLE.USER as UserRole,
    userGender: 2 as 0 | 1 | 2,
    userProfile: "",
    userPhone: "",
    userEmail: "",
});
const avatarUrl = ref<string>("");
const submitting = ref(false);

const rules: Record<string, Rule[]> = {
    userName: [
        { required: true, message: "请输入用户昵称", trigger: "blur" },
        { max: 20, message: "用户昵称不能超过 20 个字符", trigger: ["blur", "change"] },
    ],
    userProfile: [
        { max: 200, message: "个人简介不能超过 200 个字符", trigger: ["blur", "change"] },
    ],
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
};

const { handleUpdate, handleAvatarUpload: uploadAvatarHandler, uploading } = useUserOperations();

const passwordlessUser = computed(() => props.user);

watch(
    () => props.visible,
    (visible) => {
        if (visible) {
            populateForm();
        } else {
            resetForm();
        }
    }
);

watch(passwordlessUser, () => {
    if (props.visible) {
        populateForm();
    }
});

const populateForm = () => {
    if (!props.user) {
        return;
    }
    formModel.userName = props.user.userName ?? "";
    formModel.userRole = (props.user.userRole ?? USER_ROLE.USER) as UserRole;
    formModel.userGender = (props.user.userGender ?? 2) as 0 | 1 | 2;
    formModel.userProfile = props.user.userProfile ?? "";
    formModel.userPhone = props.user.userPhone ?? "";
    formModel.userEmail = props.user.userEmail ?? "";
    avatarUrl.value = props.user.userAvatar ?? "";
    formRef.value?.clearValidate();
};

const beforeAvatarUpload: UploadProps["beforeUpload"] = async (file) => {
    if (!props.user?.id) {
        return false;
    }
    const rawFile = file as File;
    const url = await uploadAvatarHandler(rawFile);
    if (url) {
        const success = await handleUpdate({ id: props.user.id, userAvatar: url });
        if (success) {
            avatarUrl.value = url;
            emit("success");
        }
    }
    return false;
};

const handleSubmit = async () => {
    if (!props.user?.id || submitting.value) {
        return;
    }
    try {
        submitting.value = true;
        await formRef.value?.validate();
        const payload: API.AdminUpdateUserInfoRequest = {
            id: props.user.id,
            userName: formModel.userName.trim(),
            userRole: formModel.userRole,
            userGender: formModel.userGender,
            userProfile: formModel.userProfile.trim() || undefined,
            userPhone: formModel.userPhone.trim() || undefined,
            userEmail: formModel.userEmail.trim() || undefined,
        };
        const success = await handleUpdate(payload);
        if (success) {
            emit("success");
            emit("update:visible", false);
        }
    } finally {
        submitting.value = false;
    }
};

const handleCancel = () => {
    emit("update:visible", false);
};

const resetForm = () => {
    formModel.userName = "";
    formModel.userRole = USER_ROLE.USER;
    formModel.userGender = 2;
    formModel.userProfile = "";
    formModel.userPhone = "";
    formModel.userEmail = "";
    avatarUrl.value = "";
    formRef.value?.resetFields();
    formRef.value?.clearValidate();
};

const formatCreateTime = (time?: string) => {
    if (!time) {
        return "";
    }
    return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
};
</script>

<style scoped>
.modal-header-card {
    padding: 16px;
    margin-bottom: 16px;
    background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
    border: 1px solid #91d5ff;
    border-radius: 12px;
}

.header-icon {
    font-size: 24px;
    color: #1677ff;
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

.avatar-tip {
    font-size: 12px;
}

.rounded-input :deep(.ant-input),
.rounded-input :deep(.ant-input-affix-wrapper) {
    border-radius: 8px;
}
</style>
