import { ref } from "vue";
import { message } from "ant-design-vue";
import {
    adminAddUser,
    adminBanOrUnbanUser,
    adminDeleteUserById,
    adminGetUserById,
    adminResetUserPassword,
    adminUpdateUserInfo,
} from "@/api/admin";
import { uploadAvatar } from "@/api/file";

/**
 * 提取错误消息
 */
const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === "string") {
        return error;
    }
    try {
        return JSON.stringify(error);
    } catch {
        return "未知错误";
    }
};

/**
 * 封装管理员用户操作的通用逻辑
 */
export const useUserOperations = () => {
    const uploading = ref(false);

    /**
     * 管理员添加用户
     */
    const handleAdd = async (payload: API.AdminAddUserRequest): Promise<boolean> => {
        const hide = message.loading("正在添加用户…", 0);
        try {
            const response = await adminAddUser(payload);
            hide();
            if (response?.success && response.data) {
                message.success("添加用户成功！");
                return true;
            }
            message.error(response?.message || "添加用户失败，请重试！");
            return false;
        } catch (error: unknown) {
            hide();
            message.error(getErrorMessage(error) || "添加用户失败，请重试！");
            return false;
        }
    };

    /**
     * 管理员获取用户详情
     */
    const handleGetUserInfo = async (id: number): Promise<API.User | null> => {
        try {
            const response = await adminGetUserById({ id });
            if (response?.success && response.data) {
                return response.data;
            }
            message.error(response?.message || "获取用户信息失败");
            return null;
        } catch (error: unknown) {
            message.error(getErrorMessage(error) || "获取用户信息失败");
            return null;
        }
    };

    /**
     * 管理员更新用户信息
     */
    const handleUpdate = async (payload: API.AdminUpdateUserInfoRequest): Promise<boolean> => {
        const hide = message.loading("正在更新用户信息…", 0);
        try {
            const response = await adminUpdateUserInfo(payload);
            hide();
            if (response?.success && response.data) {
                message.success("更新用户信息成功！");
                return true;
            }
            message.error(response?.message || "更新用户信息失败，请重试！");
            return false;
        } catch (error: unknown) {
            hide();
            message.error(getErrorMessage(error) || "更新用户信息失败，请重试！");
            return false;
        }
    };

    /**
     * 管理员删除用户
     */
    const handleDelete = async (id: number): Promise<boolean> => {
        const hide = message.loading("正在删除用户…", 0);
        try {
            const response = await adminDeleteUserById({ id });
            hide();
            if (response?.success && response.data) {
                message.success("删除用户成功！");
                return true;
            }
            message.error(response?.message || "删除用户失败，请重试！");
            return false;
        } catch (error: unknown) {
            hide();
            message.error(getErrorMessage(error) || "删除用户失败，请重试！");
            return false;
        }
    };

    /**
     * 管理员重置用户密码
     */
    const handleResetPassword = async (id: number, newPassword: string): Promise<boolean> => {
        const hide = message.loading("正在重置密码…", 0);
        try {
            const response = await adminResetUserPassword({ id, newPassword });
            hide();
            if (response?.success && response.data) {
                message.success("重置密码成功！");
                return true;
            }
            message.error(response?.message || "重置密码失败，请重试！");
            return false;
        } catch (error: unknown) {
            hide();
            message.error(getErrorMessage(error) || "重置密码失败，请重试！");
            return false;
        }
    };

    /**
     * 管理员封禁或解禁用户
     */
    const handleBanOrUnban = async (id: number, currentStatus: number): Promise<boolean> => {
        const nextStatus = currentStatus === 0 ? 1 : 0;
        const actionText = nextStatus === 1 ? "封禁" : "解禁";
        const hide = message.loading(`正在${actionText}用户…`, 0);
        try {
            const response = await adminBanOrUnbanUser({ id, userStatus: nextStatus as 0 | 1 });
            hide();
            if (response?.success && response.data) {
                message.success(`${actionText}用户成功！`);
                return true;
            }
            message.error(response?.message || `${actionText}用户失败，请重试！`);
            return false;
        } catch (error: unknown) {
            hide();
            message.error(getErrorMessage(error) || `${actionText}用户失败，请重试！`);
            return false;
        }
    };

    /**
     * 管理员上传用户头像
     */
    const handleAvatarUpload = async (file: File): Promise<string | null> => {
        const isImage = ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(file.type);
        if (!isImage) {
            message.error("只支持 JPG、PNG、GIF 格式的图片！");
            return null;
        }

        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("图片大小不能超过 2MB！");
            return null;
        }

        uploading.value = true;
        try {
            const url = await uploadAvatar(file);
            if (url) {
                message.success("头像上传成功");
                return url;
            }
            message.error("头像上传失败，请重试！");
            return null;
        } catch (error: unknown) {
            message.error(getErrorMessage(error) || "头像上传失败，请重试！");
            return null;
        } finally {
            uploading.value = false;
        }
    };

    return {
        uploading,
        handleAdd,
        handleGetUserInfo,
        handleUpdate,
        handleDelete,
        handleResetPassword,
        handleBanOrUnban,
        handleAvatarUpload,
    };
};

export type UseUserOperationsReturn = ReturnType<typeof useUserOperations>;
