import { currentUser } from '@/services/ant-design-pro/user';
import { uploadAvatar } from '@/services/ant-design-pro/file';
import { updateUserInfo, updateUserPassword } from '@/services/ant-design-pro/user';
import {
  CheckCircleOutlined,
  LockOutlined,
  SafetyOutlined,
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { PageContainer, ProForm, ProFormRadio, ProFormText } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import {
  Avatar,
  Card,
  Col,
  Divider,
  message,
  Progress,
  Row,
  Space,
  Tag,
  theme,
  Typography,
  Upload,
} from 'antd';
import React, { useState } from 'react';

const { Title, Text } = Typography;

/**
 * 账号设置页面
 */
const UserSettings: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState, setInitialState } = useModel('@@initialState');
  const [userInfo, setUserInfo] = useState<API.CurrentUser | undefined>(initialState?.currentUser);
  const [uploading, setUploading] = useState(false);

  // 刷新用户信息
  const refreshUserInfo = async () => {
    try {
      const user = await currentUser();
      setUserInfo(user);
      // 同步更新全局状态
      if (setInitialState) {
        setInitialState((s) => ({
          ...s,
          currentUser: user,
        }));
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
  };

  // 处理头像上传
  const handleAvatarUpload = async (file: File) => {
    // 1. 验证文件类型
    const isImage = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type);
    if (!isImage) {
      message.error('只支持 JPG、PNG、GIF 格式的图片！');
      return false;
    }

    // 2. 验证文件大小（2MB）
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB！');
      return false;
    }

    // 3. 上传文件
    setUploading(true);
    try {
      const avatarUrl = await uploadAvatar(file);

      // 4. 更新用户信息
      if (userInfo?.id) {
        const success = await updateUserInfo({
          id: userInfo.id,
          userAvatar: avatarUrl,
        });

        if (success) {
          message.success('头像上传成功');
          await refreshUserInfo();
        }
      }
      return true;
    } catch (error: any) {
      message.error(error.message || '头像上传失败');
      return false;
    } finally {
      setUploading(false);
    }
  };

  // 计算账号安全等级
  const calculateSecurityLevel = () => {
    let score = 0;
    let tips: string[] = [];

    // 基础分数
    score += 20;

    // 设置了邮箱
    if (userInfo?.userEmail) {
      score += 20;
    } else {
      tips.push('绑定邮箱');
    }

    // 设置了手机号
    if (userInfo?.userPhone) {
      score += 20;
    } else {
      tips.push('绑定手机号');
    }

    // 设置了头像
    if (userInfo?.userAvatar) {
      score += 15;
    } else {
      tips.push('上传头像');
    }

    // 设置了个人简介
    if (userInfo?.userProfile) {
      score += 15;
    } else {
      tips.push('完善个人简介');
    }

    // 设置了性别
    if (userInfo?.userGender !== undefined && userInfo?.userGender !== 2) {
      score += 10;
    } else {
      tips.push('设置性别');
    }

    let level: 'low' | 'medium' | 'high' = 'low';
    let levelText = '较低';
    let color = '#ff4d4f';

    if (score >= 80) {
      level = 'high';
      levelText = '高';
      color = '#52c41a';
    } else if (score >= 50) {
      level = 'medium';
      levelText = '中等';
      color = '#faad14';
    }

    return { score, level, levelText, color, tips };
  };

  const securityInfo = calculateSecurityLevel();

  // 处理基本信息提交
  const handleInfoSubmit = async (values: any) => {
    if (!userInfo?.id) {
      message.error('用户信息不存在');
      return false;
    }

    try {
      const success = await updateUserInfo({
        id: userInfo.id,
        userName: values.userName,
        userGender: values.userGender,
        userPhone: values.userPhone,
        userEmail: values.userEmail,
        userProfile: values.userProfile,
      });

      if (success) {
        message.success('基本信息更新成功');
        await refreshUserInfo();
        return true;
      }
      return false;
    } catch (error: any) {
      message.error(error.message || '更新失败');
      return false;
    }
  };

  // 处理密码修改提交
  const handlePasswordSubmit = async (values: any) => {
    if (!userInfo?.id) {
      message.error('用户信息不存在');
      return false;
    }

    // 验证新密码和确认密码是否一致
    if (values.newPassword !== values.checkPassword) {
      message.error('两次输入的新密码不一致');
      return false;
    }

    try {
      const success = await updateUserPassword({
        id: userInfo.id,
        rawPassword: values.rawPassword,
        newPassword: values.newPassword,
        checkPassword: values.checkPassword,
      });

      if (success) {
        message.success('密码修改成功，请重新登录');
        // 可以跳转到登录页
        setTimeout(() => {
          window.location.href = '/user/login';
        }, 1500);
        return true;
      }
      return false;
    } catch (error: any) {
      message.error(error.message || '密码修改失败');
      return false;
    }
  };

  return (
    <PageContainer
      header={{
        title: '账号设置',
        breadcrumb: {},
      }}
    >
      <Row gutter={[24, 24]}>
        {/* 左上：用户头像 */}
        <Col xs={24} md={12}>
          <Card
            title={
              <Space>
                <UserOutlined style={{ color: token.colorPrimary }} />
                <Text strong>用户头像</Text>
              </Space>
            }
            style={{ borderRadius: '12px', height: '100%' }}
            styles={{
              body: { padding: '32px', textAlign: 'center' },
            }}
          >
            <Avatar
              size={120}
              src={userInfo?.userAvatar}
              icon={<UserOutlined />}
              style={{
                marginBottom: '24px',
                border: `4px solid ${token.colorBgContainer}`,
                boxShadow: `0 0 0 1px ${token.colorBorder}`,
              }}
            />

            <div style={{ marginBottom: '20px' }}>
              <Title level={4} style={{ marginBottom: '8px' }}>
                {userInfo?.userName || '未设置昵称'}
              </Title>
              <Text type="secondary">@{userInfo?.userAccount}</Text>
            </div>

            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={handleAvatarUpload}
              disabled={uploading}
            >
              <a
                style={{
                  display: 'inline-block',
                  padding: '10px 32px',
                  background: token.colorPrimary,
                  color: '#fff',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                }}
              >
                {uploading ? '上传中...' : '更换头像'}
              </a>
            </Upload>

            <Text
              type="secondary"
              style={{ display: 'block', marginTop: '16px', fontSize: '12px' }}
            >
              支持 JPG、JPEG、PNG、GIF 格式
              <br />
              大小不超过 2MB
            </Text>
          </Card>
        </Col>

        {/* 右上：用户基本信息 */}
        <Col xs={24} md={12}>
          <Card
            title={
              <Space>
                <UserOutlined style={{ color: token.colorPrimary }} />
                <Text strong>基本信息</Text>
              </Space>
            }
            style={{ borderRadius: '12px', height: '100%' }}
            styles={{
              body: { padding: '24px' },
            }}
          >
            <ProForm
              layout="horizontal"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              initialValues={{
                userName: userInfo?.userName,
                userGender: userInfo?.userGender,
                userPhone: userInfo?.userPhone,
                userEmail: userInfo?.userEmail,
                userProfile: userInfo?.userProfile,
              }}
              onFinish={handleInfoSubmit}
              submitter={{
                searchConfig: {
                  submitText: '保存修改',
                },
                resetButtonProps: {
                  style: { display: 'none' },
                },
                render: (props, doms) => {
                  return (
                    <div
                      style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px' }}
                    >
                      {doms}
                    </div>
                  );
                },
              }}
              autoFocusFirstInput={false}
            >
              <ProFormText
                name="userName"
                label="用户昵称"
                placeholder="请输入用户昵称"
                rules={[{ max: 20, message: '用户昵称不能超过20个字符' }]}
              />

              <ProFormRadio.Group
                name="userGender"
                label="性别"
                options={[
                  { label: '女', value: 0 },
                  { label: '男', value: 1 },
                  { label: '未知', value: 2 },
                ]}
              />

              <ProFormText
                name="userPhone"
                label="手机号码"
                placeholder="请输入手机号码"
                rules={[{ pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }]}
              />

              <ProFormText
                name="userEmail"
                label="邮箱地址"
                placeholder="请输入邮箱地址"
                rules={[{ type: 'email', message: '邮箱格式不正确' }]}
              />

              <ProFormText
                name="userProfile"
                label="个人简介"
                placeholder="请输入个人简介"
                rules={[{ max: 200, message: '个人简介不能超过200个字符' }]}
              />
            </ProForm>
          </Card>
        </Col>

        {/* 左下：账号安全 */}
        <Col xs={24} md={12}>
          <Card
            title={
              <Space>
                <SafetyOutlined style={{ color: token.colorPrimary }} />
                <Text strong>账号安全</Text>
              </Space>
            }
            style={{ borderRadius: '12px', height: '100%' }}
            styles={{
              body: { padding: '24px' },
            }}
          >
            {/* 安全等级 */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Title level={5} style={{ marginBottom: '16px' }}>
                安全等级
              </Title>
              <Progress
                type="circle"
                percent={securityInfo.score}
                strokeColor={securityInfo.color}
                size={100}
                format={() => (
                  <div>
                    <div
                      style={{ fontSize: '20px', fontWeight: 'bold', color: securityInfo.color }}
                    >
                      {securityInfo.score}
                    </div>
                    <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>
                      {securityInfo.levelText}
                    </div>
                  </div>
                )}
              />
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {/* 安全提示 */}
            <div style={{ marginBottom: '16px' }}>
              <Text strong style={{ display: 'block', marginBottom: '12px', fontSize: '13px' }}>
                {securityInfo.score >= 80 ? (
                  <Space>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    账号安全性良好
                  </Space>
                ) : (
                  <Space>
                    <WarningOutlined style={{ color: '#faad14' }} />
                    建议完善信息
                  </Space>
                )}
              </Text>
              {securityInfo.tips.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {securityInfo.tips.map((tip) => (
                    <Tag key={tip} color="blue" style={{ fontSize: '12px' }}>
                      {tip}
                    </Tag>
                  ))}
                </div>
              )}
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {/* 账号状态 */}
            <div>
              <Text
                type="secondary"
                style={{ fontSize: '12px', display: 'block', marginBottom: '12px' }}
              >
                账号状态
              </Text>
              <Space direction="vertical" style={{ width: '100%' }} size="small">
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Text style={{ fontSize: '13px' }}>邮箱验证</Text>
                  {userInfo?.userEmail ? (
                    <Tag color="success">已验证</Tag>
                  ) : (
                    <Tag color="default">未设置</Tag>
                  )}
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Text style={{ fontSize: '13px' }}>手机验证</Text>
                  {userInfo?.userPhone ? (
                    <Tag color="success">已验证</Tag>
                  ) : (
                    <Tag color="default">未设置</Tag>
                  )}
                </div>
              </Space>
            </div>
          </Card>
        </Col>

        {/* 右下：密码管理 */}
        <Col xs={24} md={12}>
          <Card
            title={
              <Space>
                <LockOutlined style={{ color: token.colorPrimary }} />
                <Text strong>密码管理</Text>
              </Space>
            }
            style={{ borderRadius: '12px', height: '100%' }}
            styles={{
              body: { padding: '24px' },
            }}
          >
            {/* 密码安全提示 */}
            <div
              style={{
                background: token.colorInfoBg,
                border: `1px solid ${token.colorInfoBorder}`,
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '20px',
              }}
            >
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <Text strong style={{ fontSize: '13px', color: token.colorInfo }}>
                  <SafetyOutlined /> 密码安全建议
                </Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  • 密码长度 8-20 位，建议包含大小写字母、数字和特殊字符
                </Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  • 不要使用生日、电话号码等容易被猜到的信息
                </Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  • 定期更换密码，不要在多个网站使用相同密码
                </Text>
              </Space>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            <ProForm
              layout="horizontal"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              onFinish={handlePasswordSubmit}
              submitter={{
                searchConfig: {
                  submitText: '修改密码',
                },
                resetButtonProps: {
                  style: { display: 'none' },
                },
                render: (props, doms) => {
                  return (
                    <div
                      style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px' }}
                    >
                      {doms}
                    </div>
                  );
                },
              }}
              autoFocusFirstInput={false}
            >
              <ProFormText.Password
                name="rawPassword"
                label="当前密码"
                placeholder="请输入当前密码"
                rules={[
                  { required: true, message: '请输入当前密码' },
                  { min: 8, max: 20, message: '密码长度必须在8-20位之间' },
                ]}
              />

              <ProFormText.Password
                name="newPassword"
                label="新密码"
                placeholder="请输入新密码"
                rules={[
                  { required: true, message: '请输入新密码' },
                  { min: 8, max: 20, message: '密码长度必须在8-20位之间' },
                ]}
              />

              <ProFormText.Password
                name="checkPassword"
                label="确认密码"
                placeholder="请再次输入新密码"
                rules={[
                  { required: true, message: '请确认新密码' },
                  { min: 8, max: 20, message: '密码长度必须在8-20位之间' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  }),
                ]}
              />
            </ProForm>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default UserSettings;
