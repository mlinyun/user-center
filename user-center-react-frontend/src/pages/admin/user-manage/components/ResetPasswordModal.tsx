import { ModalForm, ProFormText } from '@ant-design/pro-components';
import {
  KeyOutlined,
  UserOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  LockOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { Space, Typography, Progress, Tag } from 'antd';
import React, { useState, useEffect } from 'react';

const { Text } = Typography;

interface ResetPasswordModalProps {
  visible: boolean;
  resetPasswordUser: API.CurrentUser | null;
  onVisibleChange: (visible: boolean) => void;
  onFinish: (values: { newPassword: string }) => Promise<boolean>;
}

// 密码强度检测
const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (/[a-z]/.test(password)) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/\d/.test(password)) strength += 15;
  if (/[~`!@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?]/.test(password)) strength += 10;
  return Math.min(strength, 100);
};

// 获取密码强度颜色
const getStrengthColor = (strength: number): string => {
  if (strength < 40) return '#ff4d4f';
  if (strength < 70) return '#faad14';
  return '#52c41a';
};

// 获取密码强度文本
const getStrengthText = (strength: number): string => {
  if (strength === 0) return '未输入';
  if (strength < 40) return '弱';
  if (strength < 70) return '中';
  return '强';
};

/**
 * 重置密码弹窗组件 - 科技感设计
 */
const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  visible,
  resetPasswordUser,
  onVisibleChange,
  onFinish,
}) => {
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (!visible) {
      setPasswordStrength(0);
      setNewPassword('');
    }
  }, [visible]);

  // CSS 动画样式
  const animationStyles = `
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

    .tech-card {
      animation: slideInFromTop 0.5s ease-out;
    }
  `;

  return (
    <>
      <style>{animationStyles}</style>
      <ModalForm
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
              <LockOutlined style={{ color: '#fff', fontSize: '18px' }} />
            </div>
            <span
              style={{
                background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              密码重置
            </span>
          </Space>
        }
        open={visible}
        onOpenChange={onVisibleChange}
        modalProps={{
          destroyOnHidden: true,
          width: 600,
          styles: {
            body: {
              padding: '24px',
            },
          },
        }}
        onFinish={onFinish}
        layout="vertical"
      >
        {/* 用户信息卡片 - 科技感设计 */}
        {resetPasswordUser && (
          <div
            className="tech-card"
            style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
              border: '1px solid #91d5ff',
              borderRadius: '12px',
              marginBottom: '24px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Space direction="vertical" size={12} style={{ width: '100%', position: 'relative' }}>
              {/* 标题行 */}
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Space>
                  <SafetyOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                  <Text strong style={{ fontSize: '16px', color: '#262626' }}>
                    目标用户信息
                  </Text>
                </Space>
                <Tag
                  icon={<ThunderboltOutlined />}
                  color="processing"
                  style={{
                    borderRadius: '12px',
                    padding: '4px 12px',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  安全模式
                </Tag>
              </div>

              {/* 用户详情 */}
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px',
                }}
              >
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <UserOutlined style={{ marginRight: 8, color: '#1890ff', fontSize: '16px' }} />
                    <Text strong style={{ fontSize: '15px', marginRight: 8 }}>
                      用户名称：
                    </Text>
                    <Text style={{ fontSize: '15px', color: '#262626' }}>
                      {resetPasswordUser.userName}
                    </Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <KeyOutlined style={{ marginRight: 8, color: '#096dd9', fontSize: '16px' }} />
                    <Text strong style={{ fontSize: '15px', marginRight: 8 }}>
                      登录账号：
                    </Text>
                    <Text style={{ fontSize: '15px', color: '#262626' }}>
                      {resetPasswordUser.userAccount}
                    </Text>
                  </div>
                </Space>
              </div>
            </Space>
          </div>
        )}

        {/* 密码输入区域 */}
        <div style={{ marginBottom: '16px' }}>
          <ProFormText.Password
            name="newPassword"
            label={
              <Space>
                <LockOutlined style={{ color: '#1890ff' }} />
                <span style={{ fontWeight: 600 }}>新密码</span>
              </Space>
            }
            placeholder="8-20位，含大小写字母、数字、特殊字符"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 8, max: 20, message: '密码长度必须在8-20位之间' },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?])[A-Za-z\d~`!@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?]{8,20}$/,
                message: '密码必须包含大写字母、小写字母、数字和特殊字符',
              },
            ]}
            fieldProps={{
              autoComplete: 'new-password',
              size: 'large',
              onChange: (e) => {
                const pwd = e.target.value;
                setNewPassword(pwd);
                setPasswordStrength(calculatePasswordStrength(pwd));
              },
              style: {
                borderRadius: '8px',
              },
            }}
          />

          {/* 密码强度指示器 - 优化版 */}
          {newPassword && (
            <div
              style={{
                marginTop: '12px',
                padding: '12px',
                background: '#fafafa',
                borderRadius: '8px',
                border: '1px solid #e8e8e8',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <Text style={{ fontSize: '13px', color: '#595959' }}>密码强度：</Text>
                <Tag
                  color={getStrengthColor(passwordStrength)}
                  style={{ fontWeight: 600, fontSize: '12px', margin: 0 }}
                >
                  {getStrengthText(passwordStrength)}
                </Tag>
              </div>
              <Progress
                percent={passwordStrength}
                strokeColor={getStrengthColor(passwordStrength)}
                showInfo={false}
                strokeWidth={6}
                style={{ marginBottom: '8px' }}
              />
              <Space wrap size={[6, 6]}>
                <Tag
                  icon={/[a-z]/.test(newPassword) ? <CheckCircleOutlined /> : null}
                  color={/[a-z]/.test(newPassword) ? 'success' : 'default'}
                  style={{ fontSize: '12px', margin: 0 }}
                >
                  小写
                </Tag>
                <Tag
                  icon={/[A-Z]/.test(newPassword) ? <CheckCircleOutlined /> : null}
                  color={/[A-Z]/.test(newPassword) ? 'success' : 'default'}
                  style={{ fontSize: '12px', margin: 0 }}
                >
                  大写
                </Tag>
                <Tag
                  icon={/\d/.test(newPassword) ? <CheckCircleOutlined /> : null}
                  color={/\d/.test(newPassword) ? 'success' : 'default'}
                  style={{ fontSize: '12px', margin: 0 }}
                >
                  数字
                </Tag>
                <Tag
                  icon={
                    /[~`!@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?]/.test(newPassword) ? (
                      <CheckCircleOutlined />
                    ) : null
                  }
                  color={
                    /[~`!@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?]/.test(newPassword)
                      ? 'success'
                      : 'default'
                  }
                  style={{ fontSize: '12px', margin: 0 }}
                >
                  特殊字符
                </Tag>
                <Tag
                  icon={newPassword.length >= 8 ? <CheckCircleOutlined /> : null}
                  color={newPassword.length >= 8 ? 'success' : 'default'}
                  style={{ fontSize: '12px', margin: 0 }}
                >
                  长度≥8
                </Tag>
              </Space>
            </div>
          )}
        </div>

        {/* 确认密码 */}
        <ProFormText.Password
          name="confirmPassword"
          label={
            <Space>
              <SafetyOutlined style={{ color: '#096dd9' }} />
              <span style={{ fontWeight: 600 }}>确认密码</span>
            </Space>
          }
          placeholder="再次输入新密码"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: '请再次输入新密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
          fieldProps={{
            size: 'large',
            style: {
              borderRadius: '8px',
            },
          }}
        />
      </ModalForm>
    </>
  );
};

export default ResetPasswordModal;
