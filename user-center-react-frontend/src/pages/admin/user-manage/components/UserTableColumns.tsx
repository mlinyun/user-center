import { ProColumns } from '@ant-design/pro-components';
import {
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  KeyOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyOutlined,
  TeamOutlined,
  UserOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Button, Popconfirm, Space, Tag, Tooltip, Typography, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import React from 'react';

const { Text } = Typography;

interface UserTableColumnsProps {
  onView: (record: API.CurrentUser) => void;
  onEdit: (record: API.CurrentUser) => void;
  onResetPassword: (record: API.CurrentUser) => void;
  onDelete: (record: API.CurrentUser) => void;
  onBanOrUnban: (record: API.CurrentUser) => void;
}

/**
 * 获取用户表格列定义
 */
export const getUserTableColumns = ({
  onView,
  onEdit,
  onResetPassword,
  onDelete,
  onBanOrUnban,
}: UserTableColumnsProps): ProColumns<API.CurrentUser>[] => [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 60,
    fixed: 'left',
    align: 'center',
    search: false,
  },
  {
    title: '用户信息',
    dataIndex: 'userInfo',
    width: 165,
    fixed: 'left',
    search: false,
    render: (_, record) => (
      <Space size={12}>
        <Badge count={record.userRole === 'admin' ? '管理员' : 0} offset={[-5, 5]} color="#1677ff">
          <Avatar
            size={48}
            src={record.userAvatar}
            icon={<UserOutlined />}
            style={{
              border: '2px solid #f0f0f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
        </Badge>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Text strong style={{ fontSize: '14px' }}>
              {record.userName || '未设置昵称'}
            </Text>
            {record.userRole === 'admin' && (
              <Tag color="blue" style={{ fontSize: '11px', margin: 0 }}>
                <SafetyOutlined /> 管理员
              </Tag>
            )}
          </div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <UserOutlined style={{ fontSize: '11px', marginRight: 4 }} />
            {record.userAccount}
          </Text>
        </div>
      </Space>
    ),
  },
  {
    title: '用户账号',
    dataIndex: 'userAccount',
    hideInTable: true,
    fieldProps: {
      placeholder: '请输入用户账号（精确匹配）',
    },
  },
  {
    title: '用户昵称',
    dataIndex: 'userName',
    hideInTable: true,
    fieldProps: {
      placeholder: '请输入用户昵称（模糊搜索）',
    },
  },
  {
    title: '性别',
    dataIndex: 'userGender',
    width: 90,
    align: 'center',
    valueType: 'select',
    valueEnum: {
      0: { text: '女', status: 'Default' },
      1: { text: '男', status: 'Processing' },
      2: { text: '未知', status: 'Default' },
    },
    fieldProps: {
      placeholder: '请选择性别',
    },
    render: (_, record) => {
      const genderMap = {
        0: { text: '女', icon: '♀', color: '#ff85c0' },
        1: { text: '男', icon: '♂', color: '#1677ff' },
        2: { text: '未知', icon: '?', color: '#8c8c8c' },
      };
      const gender = genderMap[record.userGender as keyof typeof genderMap] || genderMap[2];
      return (
        <Tag
          color={gender.color}
          style={{
            fontSize: '13px',
            padding: '2px 12px',
            borderRadius: '12px',
            fontWeight: '500',
          }}
        >
          {gender.icon} {gender.text}
        </Tag>
      );
    },
  },
  {
    title: '联系方式',
    dataIndex: 'contact',
    width: 200,
    search: false,
    render: (_, record) => (
      <Space direction="vertical" size={4} style={{ width: '100%' }}>
        {record.userPhone && (
          <Tooltip title="手机号码">
            <Text style={{ fontSize: '13px' }}>
              <PhoneOutlined style={{ color: '#52c41a', marginRight: 6 }} />
              {record.userPhone}
            </Text>
          </Tooltip>
        )}
        {record.userEmail && (
          <Tooltip title="邮箱地址">
            <Text
              style={{ fontSize: '13px', maxWidth: '100%' }}
              ellipsis
              copyable={{ text: record.userEmail }}
            >
              <MailOutlined style={{ color: '#1677ff', marginRight: 6 }} />
              {record.userEmail}
            </Text>
          </Tooltip>
        )}
        {!record.userPhone && !record.userEmail && (
          <Text type="secondary" style={{ fontSize: '12px' }}>
            暂无联系方式
          </Text>
        )}
      </Space>
    ),
  },
  {
    title: '手机号码',
    dataIndex: 'userPhone',
    hideInTable: true,
    fieldProps: {
      placeholder: '请输入手机号码（精确匹配）',
    },
  },
  {
    title: '邮箱地址',
    dataIndex: 'userEmail',
    hideInTable: true,
    fieldProps: {
      placeholder: '请输入邮箱地址（精确匹配）',
    },
  },
  {
    title: '星球编号',
    dataIndex: 'planetCode',
    width: 100,
    align: 'center',
    copyable: true,
    ellipsis: true,
    sorter: true,
    fieldProps: {
      placeholder: '请输入星球编号',
    },
    render: (_, record) => (
      <Text
        code
        copyable
        style={{
          fontSize: '13px',
          color: '#1677ff',
          background: '#f0f5ff',
          padding: '2px 8px',
          borderRadius: '4px',
        }}
      >
        {record.planetCode || '-'}
      </Text>
    ),
  },
  {
    title: '角色',
    dataIndex: 'userRole',
    width: 110,
    align: 'center',
    valueType: 'select',
    valueEnum: {
      user: { text: '普通用户', status: 'Default' },
      admin: { text: '管理员', status: 'Success' },
    },
    fieldProps: {
      placeholder: '请选择用户角色',
    },
    render: (_, record) => {
      if (record.userRole === 'admin') {
        return (
          <Tag
            icon={<SafetyOutlined />}
            color="blue"
            style={{ fontSize: '13px', padding: '4px 12px', fontWeight: '500' }}
          >
            管理员
          </Tag>
        );
      }
      return (
        <Tag
          icon={<TeamOutlined />}
          color="default"
          style={{ fontSize: '13px', padding: '4px 12px' }}
        >
          普通用户
        </Tag>
      );
    },
  },
  {
    title: '个人简介',
    dataIndex: 'userProfile',
    hideInTable: true,
    fieldProps: {
      placeholder: '请输入个人简介（模糊搜索）',
    },
  },
  {
    title: '状态',
    dataIndex: 'userStatus',
    width: 90,
    align: 'center',
    valueType: 'select',
    valueEnum: {
      0: { text: '正常', status: 'Success' },
      1: { text: '封禁', status: 'Error' },
    },
    fieldProps: {
      placeholder: '请选择用户状态',
    },
    render: (_, record) => {
      // 0-正常, 1-封禁
      if (record.userStatus === 0) {
        return (
          <Badge
            status="success"
            text={<Text style={{ fontSize: '13px', color: '#52c41a' }}>正常</Text>}
          />
        );
      }
      return (
        <Badge
          status="error"
          text={<Text style={{ fontSize: '13px', color: '#ff4d4f' }}>封禁</Text>}
        />
      );
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 120,
    valueType: 'dateTimeRange',
    hideInTable: false,
    sorter: true,
    defaultSortOrder: 'descend',
    fieldProps: {
      placeholder: ['开始时间', '结束时间'],
      showTime: {
        format: 'HH:mm:ss',
      },
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    search: {
      transform: (value) => {
        if (!value || value.length !== 2) {
          return {};
        }
        return {
          createTimeStart: value[0],
          createTimeEnd: value[1],
        };
      },
    },
    render: (_, record) => (
      <Tooltip title={`创建于 ${new Date(record.createTime).toLocaleString()}`}>
        <Text type="secondary" style={{ fontSize: '13px' }}>
          <ClockCircleOutlined style={{ marginRight: 4 }} />
          {new Date(record.createTime).toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </Tooltip>
    ),
  },
  {
    title: '操作',
    dataIndex: 'option',
    valueType: 'option',
    width: 200,
    fixed: 'right',
    align: 'center',
    render: (_, record) => {
      // 更多操作菜单项
      const menuItems: MenuProps['items'] = [
        {
          key: 'reset',
          icon: <KeyOutlined />,
          label: '重置密码',
          onClick: () => onResetPassword(record),
        },
        {
          key: 'ban',
          icon: record.userStatus === 0 ? <StopOutlined /> : <CheckCircleOutlined />,
          label: record.userStatus === 0 ? '封禁用户' : '解禁用户',
          onClick: () => onBanOrUnban(record),
          style: { color: record.userStatus === 0 ? '#faad14' : '#52c41a' },
        },
        {
          type: 'divider',
        },
        {
          key: 'delete',
          icon: <DeleteOutlined />,
          label: (
            <Popconfirm
              title="删除用户"
              description={
                <div>
                  <p>确定要删除用户「{record.userName}」吗？</p>
                  <p style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '8px' }}>
                    <ExclamationCircleOutlined style={{ marginRight: 4 }} />
                    此操作不可恢复，请谨慎操作！
                  </p>
                </div>
              }
              onConfirm={() => onDelete(record)}
              okText="确认删除"
              cancelText="取消"
              okButtonProps={{ danger: true }}
            >
              <span style={{ color: '#ff4d4f' }}>删除用户</span>
            </Popconfirm>
          ),
          danger: true,
        },
      ];

      return (
        <Space size={0}>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => onView(record)}>
            查看
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => onEdit(record)}>
            编辑
          </Button>
          <Dropdown menu={{ items: menuItems }} placement="bottomRight">
            <Button type="link" size="small" icon={<MoreOutlined />}>
              更多
            </Button>
          </Dropdown>
        </Space>
      );
    },
  },
];
