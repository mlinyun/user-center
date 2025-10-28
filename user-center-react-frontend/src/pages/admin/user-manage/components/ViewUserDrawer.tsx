import { ProCard } from '@ant-design/pro-components';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CrownOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  IdcardOutlined,
  MailOutlined,
  ManOutlined,
  PhoneOutlined,
  SafetyOutlined,
  UserOutlined,
  WomanOutlined,
} from '@ant-design/icons';
import { Avatar, Card, Col, Drawer, Row, Space, Statistic, Tag, Timeline, Typography } from 'antd';
import React from 'react';

const { Text, Title, Paragraph } = Typography;

// 添加动画样式
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.08);
    }
  }
`;
if (!document.head.querySelector('#drawer-animations')) {
  styleSheet.id = 'drawer-animations';
  document.head.appendChild(styleSheet);
}

interface ViewUserDrawerProps {
  visible: boolean;
  currentUser: API.User | null;
  onClose: () => void;
}

/**
 * 用户详情抽屉组件 - 现代化设计
 */
const ViewUserDrawer: React.FC<ViewUserDrawerProps> = ({ visible, currentUser, onClose }) => {
  if (!currentUser) return null;

  // 获取角色信息
  const getRoleInfo = () => {
    if (currentUser.userRole === 'admin') {
      return {
        text: '管理员',
        color: '#1677ff',
        icon: <CrownOutlined />,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        badgeBackground: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
        badgeShadow: '0 4px 12px rgba(255, 215, 0, 0.4)',
      };
    }
    return {
      text: '普通用户',
      color: '#52c41a',
      icon: <UserOutlined />,
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      badgeBackground: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      badgeShadow: '0 4px 12px rgba(79, 172, 254, 0.3)',
    };
  };

  // 获取性别信息
  const getGenderInfo = () => {
    const genderMap = {
      0: { text: '女生', icon: <WomanOutlined />, color: '#ff85c0' },
      1: { text: '男生', icon: <ManOutlined />, color: '#1677ff' },
      2: { text: '保密', icon: <GlobalOutlined />, color: '#8c8c8c' },
    };
    return genderMap[currentUser.userGender as keyof typeof genderMap] || genderMap[2];
  };

  // 获取状态信息
  const getStatusInfo = () => {
    const isNormal = currentUser.userStatus === 0;
    return {
      status: isNormal ? 'success' : 'error',
      text: isNormal ? '账号正常' : '账号封禁',
      color: isNormal ? '#52c41a' : '#ff4d4f',
    };
  };

  const roleInfo = getRoleInfo();
  const genderInfo = getGenderInfo();
  const statusInfo = getStatusInfo();

  // 格式化时间
  const formatTime = (time: string | number | Date) => {
    return new Date(time).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <Drawer
      title={null}
      width={800}
      open={visible}
      onClose={onClose}
      destroyOnHidden
      styles={{
        body: { padding: 0 },
      }}
    >
      {/* 用户头部卡片 - 带渐变背景 */}
      <div
        style={{
          background: roleInfo.background,
          padding: '40px 24px 24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 装饰性圆圈 */}
        <div
          style={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          }}
        />

        {/* 用户头像和基本信息 */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Space size={24} align="start">
            <div style={{ position: 'relative' }}>
              <Avatar
                size={100}
                src={currentUser.userAvatar}
                icon={<UserOutlined />}
                style={{
                  border: '4px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                }}
              />
              {/* 角色徽章 */}
              <div
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: roleInfo.badgeBackground,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  color: currentUser.userRole === 'admin' ? '#d48806' : '#1677ff',
                  boxShadow: roleInfo.badgeShadow,
                  border: '3px solid #fff',
                  animation: 'pulse 2s ease-in-out infinite',
                  zIndex: 10,
                }}
              >
                {roleInfo.icon}
              </div>
              {/* 在线状态指示器 */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 2,
                  right: 2,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: statusInfo.color,
                  border: '3px solid #fff',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  zIndex: 10,
                }}
              />
            </div>
            <div style={{ flex: 1, paddingTop: 8 }}>
              <Title level={3} style={{ color: '#fff', marginBottom: 8 }}>
                {currentUser.userName}
              </Title>
              <Space size={16} wrap>
                <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 14 }}>
                  <IdcardOutlined style={{ marginRight: 6 }} />@{currentUser.userAccount}
                </Text>
                <Tag
                  icon={roleInfo.icon}
                  color={roleInfo.color}
                  style={{
                    borderRadius: 12,
                    padding: '2px 12px',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }}
                >
                  {roleInfo.text}
                </Tag>
                <Tag
                  icon={genderInfo.icon}
                  color={genderInfo.color}
                  style={{
                    borderRadius: 12,
                    padding: '2px 12px',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }}
                >
                  {genderInfo.text}
                </Tag>
              </Space>
            </div>
          </Space>
        </div>
      </div>

      {/* 内容区域 */}
      <div style={{ padding: 24 }}>
        {/* 状态统计卡片 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Card
              hoverable
              style={{
                borderRadius: 12,
                textAlign: 'center',
                border: '1px solid #f0f0f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease',
              }}
            >
              <Statistic
                title="账号状态"
                value={statusInfo.text}
                valueStyle={{ color: statusInfo.color, fontSize: 18 }}
                prefix={<SafetyOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card
              hoverable
              style={{
                borderRadius: 12,
                textAlign: 'center',
                border: '1px solid #f0f0f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease',
              }}
            >
              <Statistic
                title="用户角色"
                value={roleInfo.text}
                valueStyle={{ color: roleInfo.color, fontSize: 18 }}
                prefix={roleInfo.icon}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card
              hoverable
              style={{
                borderRadius: 12,
                textAlign: 'center',
                border: '1px solid #f0f0f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease',
              }}
            >
              <Statistic
                title="用户性别"
                value={genderInfo.text}
                valueStyle={{ color: genderInfo.color, fontSize: 18 }}
                prefix={genderInfo.icon}
              />
            </Card>
          </Col>
        </Row>

        {/* 详细信息 */}
        <ProCard
          title={
            <Space>
              <IdcardOutlined style={{ color: '#1677ff' }} />
              <span>详细信息</span>
            </Space>
          }
          bordered
          headerBordered
          style={{
            marginBottom: 24,
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          {/* 用户ID和星球编号 */}
          <Row gutter={16} style={{ marginBottom: 20 }}>
            <Col span={12}>
              <Card
                size="small"
                style={{
                  background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                  border: '1px solid #e8e8f7',
                  borderRadius: 8,
                  height: '100%',
                }}
                bodyStyle={{ padding: '12px 16px' }}
              >
                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    <IdcardOutlined style={{ marginRight: 6 }} />
                    用户唯一标识
                  </Text>
                  <Text
                    copyable
                    strong
                    style={{
                      fontSize: 15,
                      fontFamily: 'SF Mono, Monaco, monospace',
                      color: '#1677ff',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {currentUser.id}
                  </Text>
                </Space>
              </Card>
            </Col>
            <Col span={12}>
              <Card
                size="small"
                style={{
                  background: 'linear-gradient(135deg, #fef5e7 0%, #fef0e3 100%)',
                  border: '1px solid #ffe7ba',
                  borderRadius: 8,
                  height: '100%',
                }}
                bodyStyle={{ padding: '12px 16px' }}
              >
                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      <EnvironmentOutlined style={{ marginRight: 6 }} />
                      星球编号
                    </Text>
                    {currentUser.planetCode && (
                      <Tag color="orange" style={{ margin: 0, fontSize: 11 }}>
                        已认证
                      </Tag>
                    )}
                  </Space>
                  <Text
                    copyable={!!currentUser.planetCode}
                    strong
                    style={{
                      fontSize: 15,
                      color: currentUser.planetCode ? '#d46b08' : '#bfbfbf',
                      fontFamily: 'SF Mono, Monaco, monospace',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {currentUser.planetCode || '未设置'}
                  </Text>
                </Space>
              </Card>
            </Col>
          </Row>

          {/* 联系方式 */}
          <div style={{ marginBottom: 20 }}>
            <Title
              level={5}
              style={{
                fontSize: 14,
                color: '#262626',
                marginBottom: 16,
                fontWeight: 600,
              }}
            >
              <PhoneOutlined style={{ marginRight: 8, color: '#52c41a' }} />
              联系方式
            </Title>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card
                  size="small"
                  hoverable
                  style={{
                    borderRadius: 8,
                    border: '1px solid #f0f0f0',
                    transition: 'all 0.3s ease',
                  }}
                  bodyStyle={{ padding: '12px 16px' }}
                >
                  <Space direction="vertical" size={6} style={{ width: '100%' }}>
                    <Space>
                      <PhoneOutlined style={{ color: '#52c41a', fontSize: 16 }} />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        手机号码
                      </Text>
                    </Space>
                    <Text
                      copyable={!!currentUser.userPhone}
                      strong
                      style={{
                        fontSize: 15,
                        color: currentUser.userPhone ? '#262626' : '#bfbfbf',
                      }}
                    >
                      {currentUser.userPhone || '未设置'}
                    </Text>
                  </Space>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  size="small"
                  hoverable
                  style={{
                    borderRadius: 8,
                    border: '1px solid #f0f0f0',
                    transition: 'all 0.3s ease',
                  }}
                  bodyStyle={{ padding: '12px 16px' }}
                >
                  <Space direction="vertical" size={6} style={{ width: '100%' }}>
                    <Space>
                      <MailOutlined style={{ color: '#1677ff', fontSize: 16 }} />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        邮箱地址
                      </Text>
                    </Space>
                    <Text
                      copyable={!!currentUser.userEmail}
                      strong
                      ellipsis={{ tooltip: currentUser.userEmail }}
                      style={{
                        fontSize: 15,
                        color: currentUser.userEmail ? '#262626' : '#bfbfbf',
                      }}
                    >
                      {currentUser.userEmail || '未设置'}
                    </Text>
                  </Space>
                </Card>
              </Col>
            </Row>
          </div>

          {/* 个人简介 */}
          <div>
            <Title
              level={5}
              style={{
                fontSize: 14,
                color: '#262626',
                marginBottom: 16,
                fontWeight: 600,
              }}
            >
              <UserOutlined style={{ marginRight: 8, color: '#722ed1' }} />
              个人简介
            </Title>
            <Card
              size="small"
              style={{
                background: '#fafafa',
                border: '1px solid #f0f0f0',
                borderRadius: 8,
              }}
              bodyStyle={{ padding: '16px' }}
            >
              {currentUser.userProfile ? (
                <Paragraph
                  style={{
                    fontSize: 14,
                    margin: 0,
                    lineHeight: '1.8',
                    whiteSpace: 'pre-wrap',
                    color: '#595959',
                  }}
                >
                  {currentUser.userProfile}
                </Paragraph>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    📝 这个用户很懒，什么都没有留下...
                  </Text>
                </div>
              )}
            </Card>
          </div>
        </ProCard>

        {/* 时间线 */}
        <ProCard
          title={
            <Space>
              <ClockCircleOutlined style={{ color: '#1677ff' }} />
              <span>时间记录</span>
            </Space>
          }
          bordered
          headerBordered
          style={{
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <Timeline
            items={[
              {
                color: 'green',
                dot: <CalendarOutlined style={{ fontSize: 16 }} />,
                children: (
                  <Space direction="vertical" size={4}>
                    <Text strong>账号创建</Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      {formatTime(currentUser.createTime)}
                    </Text>
                  </Space>
                ),
              },
              {
                color: 'blue',
                dot: <ClockCircleOutlined style={{ fontSize: 16 }} />,
                children: (
                  <Space direction="vertical" size={4}>
                    <Text strong>最后更新</Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      {formatTime(currentUser.updateTime)}
                    </Text>
                  </Space>
                ),
              },
            ]}
          />
        </ProCard>
      </div>
    </Drawer>
  );
};

export default ViewUserDrawer;
