<template>
    <a-modal
        :confirm-loading="submitting"
        :mask-closable="false"
        :open="visible"
        destroy-on-close
        title="重置用户密码"
        width="520px"
        @cancel="handleCancel"
        @ok="handleSubmit"
    >
        <div class="modal-header-card">
            <a-space>
                <KeyOutlined class="header-icon" />
                <div class="header-text">
                    <strong>为用户重置密码</strong>
                    <span>重置后请及时将新密码告知用户并督促尽快修改</span>
                </div>
            </a-space>
        </div>

        <a-alert
            v-if="user"
            :message="`当前操作账号：${user.userAccount}`"
            class="info-alert"
            description="重置后密码将立即生效，请谨慎操作。"
            show-icon
            type="warning"
        />

        <a-form
            ref="formRef"
            :model="formModel"
            :rules="rules"
            autocomplete="off"
            layout="vertical"
        >
            <a-form-item label="新密码" name="newPassword">
                <a-input-password
                    v-model:value="formModel.newPassword"
                    allow-clear
                    placeholder="请输入新的登录密码"
                >
                    <template #prefix>
                        <LockOutlined />
                    </template>
                </a-input-password>
            </a-form-item>

            <a-form-item label="确认密码" name="checkPassword">
                <a-input-password
                    v-model:value="formModel.checkPassword"
                    allow-clear
                    placeholder="请再次输入新的登录密码"
                >
                    <template #prefix>
                        <SafetyOutlined />
                    </template>
                </a-input-password>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from "vue";
import type { FormInstance } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import { KeyOutlined, LockOutlined, SafetyOutlined } from "@ant-design/icons-vue";
import { useUserOperations } from "@/views/admin/hooks/useUserOperations";
import { PASSWORD_PATTERN } from "@/constants/validation";

const props = defineProps<{
    visible: boolean;
    user: API.UserVO | null;
}>();

const emit = defineEmits<{
    (event: "update:visible", value: boolean): void;
    (event: "success"): void;
}>();

const formRef = ref<FormInstance>();
const formModel = reactive({
    newPassword: "",
    checkPassword: "",
});
const submitting = ref(false);

const rules: Record<string, Rule[]> = {
    newPassword: [
        { required: true, message: "请输入新的登录密码", trigger: "blur" },
        { min: 8, max: 20, message: "密码长度需在 8-20 位之间", trigger: ["blur", "change"] },
        {
            pattern: PASSWORD_PATTERN,
            message: "密码需包含大小写字母、数字和特殊字符",
            trigger: ["blur", "change"],
        },
    ],
    checkPassword: [
        { required: true, message: "请确认新密码", trigger: "blur" },
        {
            validator: (_rule, value) => {
                if (!value || value === formModel.newPassword) {
                    return Promise.resolve();
                }
                return Promise.reject(new Error("两次输入的密码不一致"));
            },
            trigger: ["blur", "change"],
        },
    ],
};

watch(
    () => props.visible,
    (visible) => {
        if (!visible) {
            resetForm();
        }
    }
);

const { handleResetPassword } = useUserOperations();

const handleSubmit = async () => {
    if (!props.user?.id || submitting.value) {
        return;
    }
    try {
        submitting.value = true;
        await formRef.value?.validate();
        const success = await handleResetPassword(props.user.id, formModel.newPassword);
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
    formModel.newPassword = "";
    formModel.checkPassword = "";
    formRef.value?.resetFields();
    formRef.value?.clearValidate();
};
</script>

<style scoped>
.modal-header-card {
    padding: 16px;
    margin-bottom: 16px;
    background: linear-gradient(135deg, #fff1b8 0%, #ffe58f 100%);
    border: 1px solid #ffd666;
    border-radius: 12px;
}

.header-icon {
    font-size: 24px;
    color: #fa8c16;
}

.header-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 13px;
    color: rgb(0 0 0 / 65%);
}

.info-alert {
    margin-bottom: 16px;
    border-radius: 8px;
}
</style>
