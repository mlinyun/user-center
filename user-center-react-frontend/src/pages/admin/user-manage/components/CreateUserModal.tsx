import { ModalForm, ProFormRadio, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import {
  PlusOutlined,
  UserOutlined,
  LockOutlined,
  SafetyOutlined,
  IdcardOutlined,
  ManOutlined,
  WomanOutlined,
  PhoneOutlined,
  MailOutlined,
  TeamOutlined,
  CameraOutlined,
  InfoCircleOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import { Space, Typography, Divider, Avatar, Upload, Spin, Tag, Alert } from 'antd';
import React, { useState } from 'react';
import { useUserOperations } from '../hooks/useUserOperations';

const { Text } = Typography;

interface CreateUserModalProps {
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
  onFinish: (values: API.AdminAddUserParams) => Promise<boolean>;
}

/**
 * 添加用户弹窗组件
 */
const CreateUserModal: React.FC<CreateUserModalProps> = ({
  visible,
  onVisibleChange,
  onFinish,
}) => {
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { handleAvatarUpload, uploading } = useUserOperations();

  /**
   * 处理头像上传
   */
  const onAvatarUpload = async (file: File) => {
    const url = await handleAvatarUpload(file);
    if (url) {
      setAvatarUrl(url);
    }
    return false;
  };

  /**
   * 计算密码强度
   */
  const calculatePasswordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    // 长度
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    // 包含小写字母
    if (/[a-z]/.test(password)) strength += 12.5;
    // 包含大写字母
    if (/[A-Z]/.test(password)) strength += 12.5;
    // 包含数字
    if (/\d/.test(password)) strength += 12.5;
    // 包含特殊字符
    if (/[~`!@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?]/.test(password)) strength += 12.5;
    return Math.min(strength, 100);
  };

  /**
   * 密码强度颜色
   */
  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 40) return '#ff4d4f';
    if (strength < 70) return '#faad14';
    return '#52c41a';
  };

  /**
   * 密码强度文本
   */
  const getPasswordStrengthText = (strength: number) => {
    if (strength < 40) return '弱';
    if (strength < 70) return '中';
    return '强';
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
        .create-card {
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
        .password-strength-bar {
          height: 4px;
          background: #f0f0f0;
          border-radius: 2px;
          overflow: hidden;
          margin-top: 8px;
        }
        .password-strength-fill {
          height: 100%;
          transition: width 0.3s, background-color 0.3s;
        }
      `}</style>
      <ModalForm<API.AdminAddUserParams>
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
                background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                boxShadow: '0 4px 12px rgba(82, 196, 26, 0.3)',
              }}
            >
              <PlusOutlined style={{ color: '#fff', fontSize: '18px' }} />
            </div>
            <span
              style={{
                background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              创建新用户
            </span>
          </Space>
        }
        open={visible}
        onOpenChange={(open) => {
          if (!open) {
            setAvatarUrl('');
            setPasswordStrength(0);
          }
          onVisibleChange(open);
        }}
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
            userAvatar: avatarUrl || undefined,
          });
          if (success) {
            setAvatarUrl('');
            setPasswordStrength(0);
          }
          return success;
        }}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
      >
        <div
          className="create-card"
          style={{
            padding: '16px',
            background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
            border: '1px solid #b7eb8f',
            borderRadius: '12px',
            marginBottom: '24px',
          }}
        >
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Space>
                <InfoCircleOutlined style={{ fontSize: '18px', color: '#52c41a' }} />
                <Text strong style={{ fontSize: '15px', color: '#262626' }}>
                  创建新用户账号
                </Text>
              </Space>
              <Tag color="success" style={{ borderRadius: '8px', fontSize: '12px' }}>
                新建
              </Tag>
            </div>
          </Space>
        </div>

        {/* 头像上传 */}
        <div className="avatar-section" style={{ marginBottom: '24px' }}>
          <Divider
            orientation="left"
            style={{ fontSize: '14px', fontWeight: 600, color: '#52c41a', marginTop: 0 }}
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
                      border: '3px solid #52c41a',
                      boxShadow: '0 4px 16px rgba(82, 196, 26, 0.3)',
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
              {uploading
                ? '正在上传头像...'
                : '支持 JPG、PNG、GIF 格式，文件大小不超过 2MB（可选）'}
            </Text>
          </div>
        </div>

        {/* 账号信息 */}
        <div className="info-section" style={{ marginBottom: '24px' }}>
          <Divider
            orientation="left"
            style={{ fontSize: '14px', fontWeight: 600, color: '#52c41a' }}
          >
            <Space>
              <KeyOutlined />
              <span>账号信息</span>
            </Space>
          </Divider>
          <ProFormText
            name="userAccount"
            label="登录账号"
            placeholder="请输入登录账号"
            rules={[
              { required: true, message: '请输入登录账号' },
              { min: 4, max: 16, message: '登录账号长度必须在4-16位之间' },
              { pattern: /^\w+$/, message: '登录账号只能包含字母、数字和下划线' },
            ]}
            fieldProps={{
              id: 'create-userAccount',
              prefix: <UserOutlined style={{ color: '#52c41a' }} />,
              style: { borderRadius: '8px' },
            }}
          />
          <ProFormText
            name="planetCode"
            label="星球编号"
            placeholder="请输入星球编号"
            rules={[
              { required: true, message: '请输入星球编号' },
              { max: 6, message: '星球编号长度不能超过6位' },
            ]}
            fieldProps={{
              id: 'create-planetCode',
              prefix: <IdcardOutlined style={{ color: '#52c41a' }} />,
              style: { borderRadius: '8px' },
            }}
          />
        </div>

        {/* 密码设置 */}
        <div className="info-section" style={{ marginBottom: '24px' }}>
          <Divider
            orientation="left"
            style={{ fontSize: '14px', fontWeight: 600, color: '#52c41a' }}
          >
            <Space>
              <LockOutlined />
              <span>密码设置</span>
            </Space>
          </Divider>
          <Alert
            message="密码强度要求"
            description="密码必须包含大写字母、小写字母、数字和特殊字符，长度8-20位"
            type="info"
            showIcon
            style={{ marginBottom: '16px', borderRadius: '8px' }}
          />
          <ProFormText.Password
            name="userPassword"
            label="登录密码"
            placeholder="请输入登录密码"
            rules={[
              { required: true, message: '请输入登录密码' },
              { min: 8, max: 20, message: '登录密码长度必须在8-20位之间' },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?])[A-Za-z\d~`!@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?]{8,20}$/,
                message: '密码必须包含大写字母、小写字母、数字和特殊字符',
              },
            ]}
            fieldProps={{
              id: 'create-userPassword',
              prefix: <LockOutlined style={{ color: '#52c41a' }} />,
              style: { borderRadius: '8px' },
              onChange: (e) => {
                const strength = calculatePasswordStrength(e.target.value);
                setPasswordStrength(strength);
              },
            }}
          />
          {passwordStrength > 0 && (
            <div style={{ marginBottom: '16px', marginLeft: '25%' }}>
              <Space>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  密码强度:
                </Text>
                <Text
                  strong
                  style={{ fontSize: '12px', color: getPasswordStrengthColor(passwordStrength) }}
                >
                  {getPasswordStrengthText(passwordStrength)}
                </Text>
              </Space>
              <div className="password-strength-bar">
                <div
                  className="password-strength-fill"
                  style={{
                    width: `${passwordStrength}%`,
                    backgroundColor: getPasswordStrengthColor(passwordStrength),
                  }}
                />
              </div>
            </div>
          )}
          <ProFormText.Password
            name="checkPassword"
            label="确认密码"
            placeholder="请再次输入登录密码"
            dependencies={['userPassword']}
            rules={[
              { required: true, message: '请再次输入登录密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('userPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
            fieldProps={{
              id: 'create-checkPassword',
              prefix: <LockOutlined style={{ color: '#52c41a' }} />,
              style: { borderRadius: '8px' },
            }}
          />
        </div>

        {/* 基本信息 */}
        <div className="info-section" style={{ marginBottom: '24px' }}>
          <Divider
            orientation="left"
            style={{ fontSize: '14px', fontWeight: 600, color: '#52c41a' }}
          >
            <Space>
              <UserOutlined />
              <span>基本信息</span>
            </Space>
          </Divider>
          <ProFormText
            name="userName"
            label="用户昵称"
            placeholder="请输入用户昵称（默认为登录账号）"
            rules={[{ max: 20, message: '用户昵称不能超过20个字符' }]}
            fieldProps={{
              id: 'create-userName',
              prefix: <UserOutlined style={{ color: '#52c41a' }} />,
              style: { borderRadius: '8px' },
            }}
          />
          <ProFormRadio.Group
            name="userGender"
            label="性别"
            initialValue={2}
            fieldProps={{
              id: 'create-userGender',
            }}
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
              id: 'create-userProfile',
              maxLength: 200,
              showCount: true,
              autoSize: { minRows: 3, maxRows: 5 },
              style: { borderRadius: '8px' },
            }}
            rules={[{ max: 200, message: '个人简介不能超过200个字符' }]}
          />
        </div>

        {/* 联系方式 */}
        <div className="info-section" style={{ marginBottom: '24px' }}>
          <Divider
            orientation="left"
            style={{ fontSize: '14px', fontWeight: 600, color: '#52c41a' }}
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
              id: 'create-userPhone',
              prefix: <PhoneOutlined style={{ color: '#52c41a' }} />,
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
              id: 'create-userEmail',
              prefix: <MailOutlined style={{ color: '#52c41a' }} />,
              style: { borderRadius: '8px' },
            }}
          />
        </div>

        {/* 账号类型 */}
        <div className="info-section">
          <Divider
            orientation="left"
            style={{ fontSize: '14px', fontWeight: 600, color: '#52c41a' }}
          >
            <Space>
              <TeamOutlined />
              <span>账号类型</span>
            </Space>
          </Divider>
          <ProFormRadio.Group
            name="userRole"
            label="用户角色"
            initialValue="user"
            fieldProps={{
              id: 'create-userRole',
            }}
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
                管理员拥有系统最高权限，请谨慎授予
              </Text>
            </Space>
          </div>
        </div>
      </ModalForm>
    </>
  );
};

export default CreateUserModal;
