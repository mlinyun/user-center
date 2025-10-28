import { GithubOutlined, GlobalOutlined, MailOutlined } from '@ant-design/icons';
import { Divider, Space } from 'antd';
import React from 'react';
import { GITHUB_URL } from '@/constants';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      key: 'backend',
      title: '项目源码',
      href: GITHUB_URL + '/user-center',
      icon: <GithubOutlined />,
    },

    {
      key: 'docs',
      title: '项目文档',
      href: GITHUB_URL + '/user-center/blob/main/README.md',
      icon: <GlobalOutlined />,
    },
    {
      key: 'email',
      title: '联系邮箱',
      href: 'mailto:lingyun2311@gmail.com',
      icon: <MailOutlined />,
    },
  ];

  return (
    <footer
      style={{
        textAlign: 'center',
        padding: '16px 50px',
        color: 'rgba(0, 0, 0, 0.45)',
        fontSize: '13px',
        background: 'transparent',
        borderTop: '1px solid rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* 链接区域 */}
      <div style={{ marginBottom: 12 }}>
        <Space size="small" split={<Divider type="vertical" />}>
          {footerLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'rgba(0, 0, 0, 0.45)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1890ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(0, 0, 0, 0.45)';
              }}
            >
              {link.icon} {link.title}
            </a>
          ))}
        </Space>
      </div>

      {/* 版权和备案信息 - 单行显示 */}
      <div
        style={{
          fontSize: '12px',
          color: 'rgba(0, 0, 0, 0.45)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '4px',
        }}
      >
        <span>
          Copyright © {currentYear}{' '}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'rgba(0, 0, 0, 0.65)', textDecoration: 'none', fontWeight: 400 }}
          >
            凌云 (mlinyun)
          </a>{' '}
          All Rights Reserved.
        </span>
        <Divider type="vertical" style={{ margin: '0 8px' }} />
        <a
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'rgba(0, 0, 0, 0.45)', textDecoration: 'none' }}
        >
          粤ICP备xxxxxxxx号
        </a>
      </div>
    </footer>
  );
};

export default Footer;
