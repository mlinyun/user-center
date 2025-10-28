import { GITHUB_URL } from '@/constants';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import {
  BookOutlined,
  CodeOutlined,
  GithubOutlined,
  RocketOutlined,
  SafetyOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Tag, theme, Typography } from 'antd';
import React from 'react';

const { Title, Paragraph, Text } = Typography;

/**
 * 功能特性卡片组件
 */
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  desc: string;
  tags?: string[];
}> = ({ icon, title, desc, tags }) => {
  const { token } = theme.useToken();

  return (
    <Card
      hoverable
      styles={{
        body: { padding: '24px' },
      }}
      style={{
        height: '100%',
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        background: 'transparent',
      }}
    >
      <div
        style={{
          fontSize: '32px',
          color: token.colorPrimary,
          marginBottom: '16px',
        }}
      >
        {icon}
      </div>
      <Title level={4} style={{ marginBottom: '12px' }}>
        {title}
      </Title>
      <Paragraph
        type="secondary"
        style={{
          marginBottom: tags ? '16px' : '0',
          minHeight: '66px',
        }}
      >
        {desc}
      </Paragraph>
      {tags && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {tags.map((tag) => (
            <Tag key={tag} color="blue">
              {tag}
            </Tag>
          ))}
        </div>
      )}
    </Card>
  );
};

/**
 * 技术栈卡片组件
 */
const TechStackCard: React.FC<{
  title: string;
  technologies: string[];
  color: string;
}> = ({ title, technologies, color }) => {
  return (
    <Card
      hoverable
      styles={{
        body: { padding: '20px' },
      }}
      style={{
        borderRadius: '8px',
        borderLeft: `4px solid ${color}`,
        background: 'transparent',
        transition: 'all 0.3s ease',
      }}
    >
      <Title level={5} style={{ marginBottom: '16px' }}>
        {title}
      </Title>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {technologies.map((tech) => (
          <Tag key={tech}>{tech}</Tag>
        ))}
      </div>
    </Card>
  );
};

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  // 功能特性数据
  const features = [
    {
      icon: <SafetyOutlined />,
      title: '安全可靠',
      desc: '采用 BCrypt 加密算法，Session 会话管理，AOP 权限校验，全方位保障系统安全。',
      tags: ['BCrypt', 'Session', 'AOP'],
    },
    {
      icon: <TeamOutlined />,
      title: '用户管理',
      desc: '完善的用户管理功能，支持注册、登录、信息修改、权限管理等核心业务。',
      tags: ['注册', '登录', '权限'],
    },
    {
      icon: <CodeOutlined />,
      title: '代码规范',
      desc: '遵循企业级代码规范，使用 Spotless、Checkstyle 保证代码质量和一致性。',
      tags: ['Spotless', 'Checkstyle', 'ESLint'],
    },
    {
      icon: <RocketOutlined />,
      title: '开箱即用',
      desc: '基于 Spring Boot + React 技术栈，前后端分离架构，快速上手开发。',
      tags: ['Spring Boot', 'React', 'Ant Design'],
    },
    {
      icon: <BookOutlined />,
      title: 'API 文档',
      desc: '集成 Knife4j 接口文档，自动生成 API 文档，支持在线调试。',
      tags: ['Knife4j', 'Swagger', 'OpenAPI'],
    },
    {
      icon: <GithubOutlined />,
      title: '开源项目',
      desc: '完全开源，代码托管在 GitHub，欢迎 Star 和贡献代码。',
      tags: ['GitHub', 'Apache 2.0'],
    },
  ];

  // 技术栈数据
  const techStacks = [
    {
      title: '后端技术',
      technologies: ['Spring Boot 3.5.6', 'MyBatis-Plus', 'MySQL', 'Knife4j', 'Hutool', 'Lombok'],
      color: '#52c41a',
    },
    {
      title: '前端技术',
      technologies: ['React 18', 'Ant Design Pro V6', 'Umi 4', 'TypeScript', 'ProComponents'],
      color: '#1890ff',
    },
    {
      title: '工程化',
      technologies: ['Maven', 'Pnpm', 'Spotless', 'Checkstyle', 'ESLint', 'Prettier'],
      color: '#fa8c16',
    },
  ];

  return (
    <PageContainer
      header={{
        title: null,
        breadcrumb: {},
      }}
    >
      {/* 欢迎横幅 */}
      <Card
        styles={{
          body: { padding: '48px 32px' },
        }}
        style={{
          marginBottom: '24px',
          borderRadius: '16px',
          border: `1px solid ${token.colorBorderSecondary}`,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          position: 'relative',
          overflow: 'hidden',
          background: 'transparent',
        }}
      >
        {/* 科技感背景装饰 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '40%',
            height: '100%',
            opacity: 0.05,
            background: `radial-gradient(circle, ${token.colorPrimary} 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${token.colorPrimary}15 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        <Row gutter={[48, 32]} align="middle">
          <Col xs={24} lg={14}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* 用户问候 */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                <div
                  style={{
                    width: '4px',
                    height: '32px',
                    background: `linear-gradient(180deg, ${token.colorPrimary} 0%, ${token.colorPrimaryHover} 100%)`,
                    borderRadius: '2px',
                    marginRight: '16px',
                  }}
                />
                <Title
                  level={1}
                  style={{
                    margin: 0,
                    fontSize: '42px',
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${token.colorText} 0%, ${token.colorTextSecondary} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  你好，{currentUser?.userName || '访客'}
                </Title>
              </div>

              {/* 欢迎文案 */}
              <Paragraph
                style={{
                  fontSize: '16px',
                  lineHeight: '1.8',
                  color: token.colorTextSecondary,
                  marginBottom: '32px',
                  maxWidth: '600px',
                }}
              >
                欢迎来到凌云用户中心系统 —— 一个基于 <Text strong>Spring Boot 3</Text> +{' '}
                <Text strong>React 18</Text>{' '}
                构建的企业级用户管理平台。系统提供完整的用户认证、权限管理、数据安全等核心功能，采用前后端分离架构，代码规范严谨，非常适合作为全栈项目的学习参考。
              </Paragraph>

              {/* 操作按钮 */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <a
                  href={GITHUB_URL + '/user-center'}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '12px 28px',
                    background: token.colorPrimary,
                    color: '#fff',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '15px',
                    boxShadow: `0 4px 12px ${token.colorPrimary}40`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 6px 16px ${token.colorPrimary}50`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${token.colorPrimary}40`;
                  }}
                >
                  <GithubOutlined style={{ marginRight: '8px', fontSize: '16px' }} />
                  后端代码仓库
                </a>
                <a
                  href={GITHUB_URL + '/user-center-web'}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '12px 28px',
                    background: 'transparent',
                    color: token.colorText,
                    border: `1px solid ${token.colorBorder}`,
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '15px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = token.colorPrimary;
                    e.currentTarget.style.color = token.colorPrimary;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = token.colorBorder;
                    e.currentTarget.style.color = token.colorText;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <GithubOutlined style={{ marginRight: '8px', fontSize: '16px' }} />
                  前端代码仓库
                </a>
              </div>
            </div>
          </Col>

          <Col xs={24} lg={10}>
            {/* 用户信息卡片 */}
            <Card
              styles={{
                body: { padding: '24px' },
              }}
              style={{
                background: `linear-gradient(135deg, ${token.colorPrimaryBg} 0%, ${token.colorBgContainer} 100%)`,
                border: `1px solid ${token.colorPrimaryBorder}`,
                borderRadius: '12px',
                boxShadow: 'none',
              }}
            >
              <div style={{ marginBottom: '20px' }}>
                <Text
                  style={{
                    fontSize: '14px',
                    color: token.colorTextSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontWeight: 600,
                  }}
                >
                  用户信息
                </Text>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Text type="secondary">当前角色</Text>
                  <Tag
                    color={currentUser?.userRole === 'admin' ? 'gold' : 'blue'}
                    style={{ margin: 0, fontWeight: 500 }}
                  >
                    {currentUser?.userRole === 'admin' ? '管理员' : '普通用户'}
                  </Tag>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Text type="secondary">登录账号</Text>
                  <Text strong>{currentUser?.userAccount || '-'}</Text>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Text type="secondary">邮箱地址</Text>
                  <Text>{currentUser?.userEmail || '未设置'}</Text>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Text type="secondary">星球编号</Text>
                  <Text code>{currentUser?.planetCode || '-'}</Text>
                </div>
              </div>

              <div
                style={{
                  marginTop: '20px',
                  paddingTop: '20px',
                  borderTop: `1px solid ${token.colorBorderSecondary}`,
                }}
              >
                <Text type="secondary" style={{ fontSize: '13px' }}>
                  账号创建时间：
                  {currentUser?.createTime
                    ? new Date(currentUser.createTime).toLocaleString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-'}
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 功能特性 */}
      <Card
        title={
          <Title level={3} style={{ marginBottom: 0 }}>
            ✨ 核心功能特性
          </Title>
        }
        styles={{
          body: { padding: '24px' },
        }}
        style={{ marginBottom: '24px', borderRadius: '12px', background: 'transparent' }}
      >
        <Row gutter={[24, 24]}>
          {features.map((feature) => (
            <Col xs={24} sm={12} lg={8} key={feature.title}>
              <FeatureCard {...feature} />
            </Col>
          ))}
        </Row>
      </Card>

      {/* 技术栈 */}
      <Card
        title={
          <Title level={3} style={{ marginBottom: 0 }}>
            🔧 技术栈
          </Title>
        }
        styles={{
          body: { padding: '24px' },
        }}
        style={{ marginBottom: '24px', borderRadius: '12px', background: 'transparent' }}
      >
        <Row gutter={[24, 24]}>
          {techStacks.map((stack) => (
            <Col xs={24} lg={8} key={stack.title}>
              <TechStackCard {...stack} />
            </Col>
          ))}
        </Row>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
