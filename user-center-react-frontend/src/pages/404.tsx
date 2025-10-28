import { history } from '@umijs/max';
import { Button, Space, Typography } from 'antd';
import { HomeOutlined, RocketOutlined } from '@ant-design/icons';
import React from 'react';

const { Title, Text } = Typography;

const NoFoundPage: React.FC = () => {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #ffffff 0%, #f0f5ff 50%, #e6f4ff 100%)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* 星星背景 */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              background: `rgba(22, 119, 255, ${0.2 + Math.random() * 0.3})`,
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 4}s infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* 漂浮的星球和装饰 */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          fontSize: '80px',
          animation: 'float 6s ease-in-out infinite',
          opacity: 0.15,
        }}
      >
        🪐
      </div>
      <div
        style={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          fontSize: '50px',
          animation: 'float 5s ease-in-out infinite',
          animationDelay: '1s',
          opacity: 0.2,
        }}
      >
        ⭐
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '8%',
          fontSize: '60px',
          animation: 'rotate 15s linear infinite',
          opacity: 0.15,
        }}
      >
        🌟
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '25%',
          right: '12%',
          fontSize: '70px',
          animation: 'float 7s ease-in-out infinite',
          animationDelay: '2s',
          opacity: 0.15,
        }}
      >
        🌙
      </div>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '5%',
          fontSize: '40px',
          animation: 'float 4s ease-in-out infinite',
          animationDelay: '0.5s',
          opacity: 0.2,
        }}
      >
        💫
      </div>
      <div
        style={{
          position: 'absolute',
          top: '60%',
          right: '8%',
          fontSize: '45px',
          animation: 'rotate 20s linear infinite',
          opacity: 0.15,
        }}
      >
        🌍
      </div>
      <div
        style={{
          position: 'absolute',
          top: '35%',
          right: '25%',
          fontSize: '35px',
          animation: 'float 5.5s ease-in-out infinite',
          animationDelay: '1.5s',
          opacity: 0.2,
        }}
      >
        ✨
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '35%',
          left: '20%',
          fontSize: '55px',
          animation: 'float 6.5s ease-in-out infinite',
          animationDelay: '0.8s',
          opacity: 0.15,
        }}
      >
        🚀
      </div>

      {/* 主内容 */}
      <div
        style={{
          textAlign: 'center',
          zIndex: 1,
          position: 'relative',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          padding: '60px 80px',
          borderRadius: '30px',
          boxShadow: '0 20px 60px rgba(22, 119, 255, 0.1)',
          border: '1px solid rgba(22, 119, 255, 0.1)',
        }}
      >
        {/* 宇航员 */}
        <div
          style={{
            fontSize: '120px',
            marginBottom: '30px',
            animation: 'float 3s ease-in-out infinite',
            filter: 'drop-shadow(0 10px 20px rgba(22, 119, 255, 0.15))',
          }}
        >
          🧑‍🚀
        </div>

        {/* 404 文字 */}
        <Title
          level={1}
          style={{
            color: '#1677ff',
            fontSize: '96px',
            fontWeight: 'bold',
            margin: '0 0 20px 0',
            textShadow: '0 4px 8px rgba(22, 119, 255, 0.1)',
            letterSpacing: '10px',
          }}
        >
          404
        </Title>

        <Title
          level={3}
          style={{
            color: '#4096ff',
            fontWeight: 'normal',
            marginBottom: '10px',
          }}
        >
          Houston, we have a problem!
        </Title>

        <Text
          style={{
            display: 'block',
            color: '#8c8c8c',
            fontSize: '16px',
            marginBottom: '40px',
          }}
        >
          抱歉，您访问的页面在宇宙中迷路了...
        </Text>

        {/* 按钮组 */}
        <Space size="large">
          <Button
            type="primary"
            size="large"
            icon={<HomeOutlined />}
            onClick={() => history.push('/')}
            style={{
              height: '48px',
              padding: '0 32px',
              fontSize: '16px',
              borderRadius: '24px',
              boxShadow: '0 4px 12px rgba(22, 119, 255, 0.2)',
              fontWeight: '500',
            }}
          >
            返回首页
          </Button>
          <Button
            size="large"
            icon={<RocketOutlined />}
            onClick={() => history.back()}
            style={{
              height: '48px',
              padding: '0 32px',
              fontSize: '16px',
              borderRadius: '24px',
              background: 'white',
              color: '#1677ff',
              border: '1px solid #d9d9d9',
              fontWeight: '500',
            }}
          >
            返回上一页
          </Button>
        </Space>
      </div>

      {/* CSS 动画 */}
      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(5deg);
            }
          }

          @keyframes rotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes twinkle {
            0%, 100% {
              opacity: 0.2;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.5);
            }
          }
        `}
      </style>
    </div>
  );
};

export default NoFoundPage;
