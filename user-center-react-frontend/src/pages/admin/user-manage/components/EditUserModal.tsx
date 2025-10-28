import { ModalForm, ProFormRadio, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import {
  EditOutlined,
  UserOutlined,
  ManOutlined,
  WomanOutlined,
  PhoneOutlined,
  MailOutlined,
  InfoCircleOutlined,
  CameraOutlined,
  SafetyOutlined,
  IdcardOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Space, Typography, Tag, Divider, Avatar, Upload, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import { useUserOperations } from '../hooks/useUserOperations';

const { Text } = Typography;

interface EditUserModalProps {
  visible: boolean;
  editingUser: API.User | null;
  onVisibleChange: (visible: boolean) => void;
  onFinish: (values: API.AdminUpdateUserInfoParams) => Promise<boolean>;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  visible,
  editingUser,
  onVisibleChange,
  onFinish,
}) => {
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const { handleAvatarUpload, handleUpdate, uploading } = useUserOperations();

  useEffect(() => {
    if (visible && editingUser) {
      setAvatarUrl(editingUser.userAvatar || '');
    } else if (!visible) {
      setAvatarUrl('');
    }
  }, [visible, editingUser]);

  /**
   * 处理头像上传
   * 流程:
   * 1. 上传文件到服务器
   * 2. 获取头像 URL
   * 3. 立即调用更新用户信息接口,将新头像 URL 保存到数据库
   * 4. 更新本地头像显示
   * 注意: 不关闭弹窗,用户可以继续编辑其他信息
   */
  const onAvatarUpload = async (file: File) => {
    if (!editingUser?.id) {
      return false;
    }

    // 步骤 1-2: 上传文件到服务器
    const url = await handleAvatarUpload(file);
    if (url) {
      // 步骤 3: 立即更新用户头像信息到数据库
      const success = await handleUpdate({
        id: editingUser.id,
        userAvatar: url, // 使用新上传的头像 URL
      });

      if (success) {
        // 步骤 4: 更新本地头像显示,同时更新 editingUser 的头像 URL
        setAvatarUrl(url);
        // 更新 editingUser 对象中的头像,确保后续操作使用新的头像 URL
        if (editingUser) {
          editingUser.userAvatar = url;
        }
        // 注意: 不调用 onFinish,保持弹窗打开,用户可以继续编辑其他信息
      }
    }
    return false; // 阻止 Upload 组件的自动上传行为
  };

  return (
    <>
      <style>{`
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .edit-card {
          animation: slideInFromTop 0.5s ease-out;
        }
        .info-section {
          animation: fadeIn 0.6s ease-out;
        }
        .avatar-section {
          animation: scaleIn 0.5s ease-out;
        }
        .avatar-upload-wrapper {
          position: relative;
          display: inline-block;
          cursor: pointer;
        }
        .avatar-upload-wrapper:hover .avatar-mask {
          opacity: 1;
        }
        .avatar-mask {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.3s;
          color: #fff;
          font-size: 14px;
        }
        .avatar-mask .camera-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }
      `}</style>
      <ModalForm<API.AdminUpdateUserInfoParams>
        title={
          <Space style={{ fontSize: '16px', fontWeight: 600 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)',
              }}
            >
              <EditOutlined style={{ color: '#fff', fontSize: '18px' }} />
            </div>
            <span
              style={{
                background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              编辑用户信息
            </span>
          </Space>
        }
        open={visible}
        onOpenChange={onVisibleChange}
        modalProps={{
          destroyOnHidden: true,
          width: 680,
          styles: {
            body: {
              padding: '24px',
            },
          },
        }}
        onFinish={async (values) => {
          const success = await onFinish({
            ...values,
            id: editingUser?.id || '',
            userAvatar: avatarUrl || editingUser?.userAvatar || '',
          });
          return success;
        }}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        request={async () => {
          if (!editingUser) {
            setAvatarUrl('');
            return {
              id: '',
              userName: '',
              userRole: 'user',
              userGender: 2,
              userPhone: '',
              userEmail: '',
              userAvatar: '',
              userProfile: '',
            };
          }
          setAvatarUrl(editingUser.userAvatar || '');
          return {
            id: editingUser.id,
            userName: editingUser.userName,
            userRole: editingUser.userRole,
            userGender: editingUser.userGender,
            userPhone: editingUser.userPhone,
            userEmail: editingUser.userEmail,
            userAvatar: editingUser.userAvatar,
            userProfile: editingUser.userProfile,
          };
        }}
      >
        {editingUser && (
          <div
            className="edit-card"
            style={{
              padding: '16px',
              background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
              border: '1px solid #91d5ff',
              borderRadius: '12px',
              marginBottom: '24px',
            }}
          >
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Space>
                  <InfoCircleOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
                  <Text strong style={{ fontSize: '15px', color: '#262626' }}>
                    编辑用户
                  </Text>
                </Space>
                <Tag color="processing" style={{ borderRadius: '8px', fontSize: '12px' }}>
                  账号：{editingUser.userAccount}
                </Tag>
              </div>
            </Space>
          </div>
        )}
        <div className="avatar-section" style={{ marginBottom: '24px' }}>
          <Divider
            orientation="left"
            style={{ fontSize: '14px', fontWeight: 600, color: '#1890ff', marginTop: 0 }}
          >
            <Space>
              <IdcardOutlined />
              <span>用户头像</span>
            </Space>
          </Divider>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Upload showUploadList={false} beforeUpload={onAvatarUpload} accept="image/*">
              <div className="avatar-upload-wrapper">
                <Spin spinning={uploading}>
                  <Avatar
                    src={avatarUrl}
                    size={120}
                    icon={<UserOutlined />}
                    style={{
                      border: '3px solid #1890ff',
                      boxShadow: '0 4px 16px rgba(24, 144, 255, 0.3)',
                      backgroundColor: avatarUrl ? 'transparent' : '#f0f0f0',
                    }}
                  />
                </Spin>
                {!uploading && (
                  <div className="avatar-mask">
                    <CameraOutlined className="camera-icon" />
                    <div>点击上传头像</div>
                  </div>
                )}
              </div>
            </Upload>
          </div>
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {uploading ? '正在上传头像...' : '支持 JPG、PNG、GIF 格式，文件大小不超过 5MB'}
            </Text>
          </div>
        </div>
        <div className="info-section" style={{ marginBottom: '24px' }}>
          <Divider
            orientation="left"
            style={{ fontSize: '14px', fontWeight: 600, color: '#1890ff' }}
          >
            <Space>
              <UserOutlined />
              <span>基本信息</span>
            </Space>
          </Divider>
          <ProFormText
            name="userName"
            label="用户昵称"
            placeholder="请输入用户昵称"
            rules={[
              { required: true, message: '请输入用户昵称' },
              { max: 20, message: '用户昵称不能超过20个字符' },
            ]}
            fieldProps={{
              prefix: <UserOutlined style={{ color: '#1890ff' }} />,
              style: { borderRadius: '8px' },
            }}
          />
          <ProFormRadio.Group
            name="userGender"
            label="性别"
            options={[
              {
                label: (
                  <Space>
                    <WomanOutlined style={{ color: '#eb2f96' }} />
                    <span>女</span>
                  </Space>
                ),
                value: 0,
              },
              {
                label: (
                  <Space>
                    <ManOutlined style={{ color: '#1890ff' }} />
                    <span>男</span>
                  </Space>
                ),
                value: 1,
              },
              {
                label: (
                  <Space>
                    <UserOutlined style={{ color: '#8c8c8c' }} />
                    <span>未知</span>
                  </Space>
                ),
                value: 2,
              },
            ]}
          />
          <ProFormTextArea
            name="userProfile"
            label="个人简介"
            placeholder="请输入个人简介"
            fieldProps={{
              maxLength: 200,
              showCount: true,
              autoSize: { minRows: 3, maxRows: 5 },
              style: { borderRadius: '8px' },
            }}
            rules={[{ max: 200, message: '个人简介不能超过200个字符' }]}
          />
        </div>
        <div className="info-section" style={{ marginBottom: '24px' }}>
          <Divider
            orientation="left"
            style={{ fontSize: '14px', fontWeight: 600, color: '#1890ff' }}
          >
            <Space>
              <PhoneOutlined />
              <span>联系方式</span>
            </Space>
          </Divider>
          <ProFormText
            name="userPhone"
            label="手机号"
            placeholder="请输入11位手机号"
            rules={[
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '手机号格式不正确',
              },
            ]}
            fieldProps={{
              prefix: <PhoneOutlined style={{ color: '#1890ff' }} />,
              style: { borderRadius: '8px' },
            }}
          />
          <ProFormText
            name="userEmail"
            label="邮箱地址"
            placeholder="请输入邮箱地址"
            rules={[
              {
                type: 'email',
                message: '邮箱格式不正确',
              },
            ]}
            fieldProps={{
              prefix: <MailOutlined style={{ color: '#1890ff' }} />,
              style: { borderRadius: '8px' },
            }}
          />
        </div>
        <div className="info-section">
          <Divider
            orientation="left"
            style={{ fontSize: '14px', fontWeight: 600, color: '#1890ff' }}
          >
            <Space>
              <TeamOutlined />
              <span>账号类型</span>
            </Space>
          </Divider>
          <ProFormRadio.Group
            name="userRole"
            label="用户角色"
            options={[
              { label: '普通用户', value: 'user' },
              { label: '管理员', value: 'admin' },
            ]}
          />
          <div
            style={{
              padding: '12px 16px',
              background: '#fff7e6',
              border: '1px solid #ffd591',
              borderRadius: '8px',
              marginTop: '12px',
            }}
          >
            <Space>
              <SafetyOutlined style={{ color: '#faad14' }} />
              <Text type="warning" style={{ fontSize: '13px' }}>
                管理员拥有系统最高权限,请谨慎授予
              </Text>
            </Space>
          </div>
        </div>
      </ModalForm>
    </>
  );
};

export default EditUserModal;
