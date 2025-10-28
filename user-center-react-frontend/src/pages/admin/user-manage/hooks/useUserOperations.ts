import {
  adminAddUser,
  adminDeleteUserById,
  adminGetUserInfoById,
  adminRestUserPassword,
  adminUpdateUserInfo,
  adminBanOrUnbanUser,
} from '@/services/ant-design-pro/admin';
import { uploadAvatar } from '@/services/ant-design-pro/file';
import { message } from 'antd';
import { useState } from 'react';

/**
 * 用户操作相关的自定义 Hook
 * 封装所有用户 CRUD 操作的业务逻辑
 */
export const useUserOperations = () => {
  const [uploading, setUploading] = useState(false);
  /**
   * 添加用户
   * @param fields 表单字段
   * @returns 是否成功
   */
  const handleAdd = async (fields: API.AdminAddUserParams): Promise<boolean> => {
    const hide = message.loading('正在添加用户...');
    try {
      await adminAddUser(fields);
      hide();
      message.success('添加用户成功！');
      return true;
    } catch (error: any) {
      hide();
      message.error(error.message || '添加用户失败，请重试！');
      return false;
    }
  };

  /**
   * 获取用户详情
   * @param id 用户 ID
   * @returns 用户信息
   */
  const handleGetUserInfo = async (id: string): Promise<API.User | null> => {
    try {
      return await adminGetUserInfoById({ id });
    } catch (error: any) {
      message.error(error.message || '获取用户信息失败');
      return null;
    }
  };

  /**
   * 更新用户信息
   * @param fields 表单字段
   * @returns 是否成功
   */
  const handleUpdate = async (fields: API.AdminUpdateUserInfoParams): Promise<boolean> => {
    const hide = message.loading('正在更新用户信息...');
    try {
      await adminUpdateUserInfo(fields);
      hide();
      message.success('更新用户信息成功！');
      return true;
    } catch (error: any) {
      hide();
      message.error(error.message || '更新用户信息失败，请重试！');
      return false;
    }
  };

  /**
   * 删除用户
   * @param id 用户 ID
   * @returns 是否成功
   */
  const handleDelete = async (id: string): Promise<boolean> => {
    const hide = message.loading('正在删除用户...');
    try {
      await adminDeleteUserById({ id });
      hide();
      message.success('删除用户成功！');
      return true;
    } catch (error: any) {
      hide();
      message.error(error.message || '删除用户失败，请重试！');
      return false;
    }
  };

  /**
   * 重置用户密码
   * @param id 用户 ID
   * @param newPassword 新密码
   * @returns 是否成功
   */
  const handleResetPassword = async (id: string, newPassword: string): Promise<boolean> => {
    const hide = message.loading('正在重置密码...');
    try {
      await adminRestUserPassword({ id, newPassword });
      hide();
      message.success('重置密码成功！');
      return true;
    } catch (error: any) {
      hide();
      message.error(error.message || '重置密码失败，请重试！');
      return false;
    }
  };

  /**
   * 处理头像上传
   * @param file 文件对象
   * @returns 上传后的头像 URL，失败返回 null
   */
  const handleAvatarUpload = async (file: File): Promise<string | null> => {
    // 1. 验证文件类型
    const isImage = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type);
    if (!isImage) {
      message.error('只支持 JPG、PNG、GIF 格式的图片！');
      return null;
    }

    // 2. 验证文件大小（2MB）
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB！');
      return null;
    }

    // 3. 上传文件
    setUploading(true);
    try {
      const avatarUrl = await uploadAvatar(file);
      message.success('头像上传成功');
      return avatarUrl;
    } catch (error: any) {
      message.error(error.message || '头像上传失败');
      return null;
    } finally {
      setUploading(false);
    }
  };

  /**
   * 封禁或解禁用户
   * @param id 用户 ID
   * @param currentStatus 当前状态 (0-正常, 1-封禁)
   * @returns 是否成功
   */
  const handleBanOrUnban = async (id: string, currentStatus: number): Promise<boolean> => {
    // 切换状态: 0->1(封禁), 1->0(解禁)
    const newStatus = currentStatus === 0 ? 1 : 0;
    const action = newStatus === 1 ? '封禁' : '解禁';

    const hide = message.loading(`正在${action}用户...`);
    try {
      await adminBanOrUnbanUser({ id, userStatus: newStatus });
      hide();
      message.success(`${action}用户成功！`);
      return true;
    } catch (error: any) {
      hide();
      message.error(error.message || `${action}用户失败，请重试！`);
      return false;
    }
  };

  return {
    handleAdd,
    handleGetUserInfo,
    handleUpdate,
    handleDelete,
    handleResetPassword,
    handleAvatarUpload,
    handleBanOrUnban,
    uploading,
  };
};
