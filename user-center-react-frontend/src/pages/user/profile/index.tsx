import { currentUser } from '@/services/ant-design-pro/user';
import {
  MailOutlined,
  ManOutlined,
  PhoneOutlined,
  UserOutlined,
  WomanOutlined,
} from '@ant-design/icons';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Avatar, Card, Col, Row, Space, Tag, theme, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

const { Title, Text } = Typography;

/**
 * 个人中心/个人资料页面
 */
const UserProfile: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState, setInitialState } = useModel('@@initialState');
  const [userInfo, setUserInfo] = useState<API.CurrentUser | undefined>(initialState?.currentUser);
  const [loading, setLoading] = useState(false);

  // 刷新用户信息
  const refreshUserInfo = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 如果全局状态没有用户信息，则重新获取
    if (!initialState?.currentUser) {
      refreshUserInfo();
    }
  }, []);

  // 性别显示
  const getGenderDisplay = (gender?: number) => {
    if (gender === 0) {
      return (
        <Space>
          <WomanOutlined style={{ color: '#eb2f96' }} />
          <Text>女</Text>
        </Space>
      );
    }
    if (gender === 1) {
      return (
        <Space>
          <ManOutlined style={{ color: '#1890ff' }} />
          <Text>男</Text>
        </Space>
      );
    }
    if (gender === 2) {
      return (
        <Space>
          <UserOutlined style={{ color: token.colorTextTertiary }} />
          <Text type="secondary">未知</Text>
        </Space>
      );
    }
    return <Text type="secondary">未设置</Text>;
  };

  // 角色显示
  const getRoleDisplay = (role?: string) => {
    if (role === 'admin') {
      return <Tag color="gold">管理员</Tag>;
    }
    return <Tag color="blue">普通用户</Tag>;
  };

  // 计算账号使用天数
  const getAccountDays = (createTime?: Date) => {
    if (!createTime) return 0;
    const now = new Date();
    const create = new Date(createTime);
    const diffTime = Math.abs(now.getTime() - create.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <PageContainer
      header={{
        title: '个人中心',
        breadcrumb: {},
      }}
      loading={loading}
    >
      <Row gutter={[24, 24]} style={{ alignItems: 'stretch' }}>
        {/* 左侧：用户基本信息卡片 */}
        <Col xs={24} md={8} style={{ display: 'flex' }}>
          <Card
            styles={{
              body: { padding: '32px' },
            }}
            style={{
              borderRadius: '12px',
              textAlign: 'center',
              width: '100%',
            }}
          >
            {/* 用户头像 */}
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

            {/* 用户名和账号 */}
            <Title level={3} style={{ marginBottom: '8px' }}>
              {userInfo?.userName || '未设置昵称'}
            </Title>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              @{userInfo?.userAccount}
            </Text>

            {/* 角色标签 */}
            <div style={{ marginTop: '16px', marginBottom: '24px' }}>
              {getRoleDisplay(userInfo?.userRole)}
            </div>

            {/* 用户简介 */}
            {userInfo?.userProfile && (
              <div
                style={{
                  padding: '16px',
                  background: token.colorBgLayout,
                  borderRadius: '8px',
                  marginBottom: '24px',
                }}
              >
                <Text type="secondary" style={{ fontSize: '13px', lineHeight: '1.6' }}>
                  {userInfo.userProfile}
                </Text>
              </div>
            )}

            {/* 用户统计信息 */}
            <div
              style={{
                marginTop: '24px',
                padding: '20px',
                background: token.colorBgContainer,
                border: `1px solid ${token.colorBorderSecondary}`,
                borderRadius: '12px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
              }}
            >
              {/* 用户ID */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  marginBottom: '20px',
                  paddingBottom: '20px',
                  borderBottom: `1px dashed ${token.colorBorderSecondary}`,
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: token.colorPrimaryBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    flexShrink: 0,
                  }}
                >
                  🆔
                </div>
                <div style={{ flex: 1 }}>
                  <Text
                    type="secondary"
                    style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}
                  >
                    用户 ID
                  </Text>
                  <Text
                    copyable
                    code
                    style={{
                      fontSize: '14px',
                      fontFamily: 'Monaco, Consolas, monospace',
                      fontWeight: 500,
                    }}
                  >
                    {userInfo?.id || '-'}
                  </Text>
                </div>
              </div>

              {/* 账号使用天数 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: token.colorPrimaryBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    flexShrink: 0,
                  }}
                >
                  📅
                </div>
                <div style={{ flex: 1 }}>
                  <Text
                    type="secondary"
                    style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}
                  >
                    账号使用天数
                  </Text>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'center',
                      gap: '4px',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        color: token.colorPrimary,
                        lineHeight: 1,
                      }}
                    >
                      {getAccountDays(userInfo?.createTime)}
                    </Text>
                    <Text style={{ fontSize: '16px', color: token.colorTextSecondary }}>天</Text>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* 右侧：详细信息 */}
        <Col xs={24} md={16} style={{ display: 'flex', flexDirection: 'column' }}>
          {/* 账号信息 */}
          <Card
            title={
              <Space>
                <UserOutlined style={{ color: token.colorPrimary }} />
                <Text strong>账号信息</Text>
              </Space>
            }
            style={{ marginBottom: '24px', borderRadius: '12px' }}
            styles={{
              body: { padding: '24px' },
            }}
          >
            <ProDescriptions
              column={2}
              dataSource={userInfo}
              columns={[
                {
                  title: '登录账号',
                  key: 'userAccount',
                  dataIndex: 'userAccount',
                  copyable: true,
                  render: (text) => text || '-',
                },
                {
                  title: '用户昵称',
                  key: 'userName',
                  dataIndex: 'userName',
                  render: (text) => text || '未设置',
                },
                {
                  title: '用户角色',
                  key: 'userRole',
                  dataIndex: 'userRole',
                  render: (_, record) => getRoleDisplay(record.userRole),
                },
                {
                  title: '性别',
                  key: 'userGender',
                  dataIndex: 'userGender',
                  render: (_, record) => getGenderDisplay(record.userGender),
                },
              ]}
            />
          </Card>

          {/* 联系方式 */}
          <Card
            title={
              <Space>
                <PhoneOutlined style={{ color: token.colorPrimary }} />
                <Text strong>联系方式</Text>
              </Space>
            }
            style={{ marginBottom: '24px', borderRadius: '12px' }}
            styles={{
              body: { padding: '24px' },
            }}
          >
            <ProDescriptions
              column={2}
              dataSource={userInfo}
              columns={[
                {
                  title: '邮箱地址',
                  key: 'userEmail',
                  dataIndex: 'userEmail',
                  copyable: true,
                  render: (text) => {
                    if (!text) return <Text type="secondary">未设置</Text>;
                    return (
                      <Space>
                        <MailOutlined style={{ color: token.colorPrimary }} />
                        <Text>{text}</Text>
                      </Space>
                    );
                  },
                },
                {
                  title: '手机号码',
                  key: 'userPhone',
                  dataIndex: 'userPhone',
                  copyable: true,
                  render: (text) => {
                    if (!text) return <Text type="secondary">未设置</Text>;
                    return (
                      <Space>
                        <PhoneOutlined style={{ color: token.colorPrimary }} />
                        <Text>{text}</Text>
                      </Space>
                    );
                  },
                },
                {
                  title: '星球编号',
                  key: 'planetCode',
                  dataIndex: 'planetCode',
                  copyable: true,
                  render: (text) => {
                    if (!text) return <Text type="secondary">未设置</Text>;
                    return <Text code>{text}</Text>;
                  },
                },
              ]}
            />
          </Card>

          {/* 系统信息 */}
          <Card
            title={
              <Space>
                <span style={{ fontSize: '16px' }}>⏰</span>
                <Text strong>系统信息</Text>
              </Space>
            }
            style={{ borderRadius: '12px' }}
            styles={{
              body: { padding: '24px' },
            }}
          >
            <ProDescriptions
              column={2}
              dataSource={userInfo}
              columns={[
                {
                  title: '账号创建时间',
                  key: 'createTime',
                  dataIndex: 'createTime',
                  valueType: 'dateTime',
                  render: (_, record) => {
                    if (!record.createTime) return '-';
                    return new Date(record.createTime).toLocaleString('zh-CN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                  },
                },
                {
                  title: '最近更新时间',
                  key: 'updateTime',
                  dataIndex: 'updateTime',
                  valueType: 'dateTime',
                  render: (_, record) => {
                    if (!record.updateTime) return '-';
                    return new Date(record.updateTime).toLocaleString('zh-CN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                  },
                },
                {
                  title: '最近编辑时间',
                  key: 'editTime',
                  dataIndex: 'editTime',
                  valueType: 'dateTime',
                  span: 2,
                  render: (_, record) => {
                    if (!record.editTime) return <Text type="secondary">从未编辑</Text>;
                    return new Date(record.editTime).toLocaleString('zh-CN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                  },
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default UserProfile;
