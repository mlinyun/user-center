import { adminGetUserInfoByPage } from '@/services/ant-design-pro/admin';
import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components';
import { PlusOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import React, { useRef, useState } from 'react';
import {
  CreateUserModal,
  EditUserModal,
  ResetPasswordModal,
  getUserTableColumns,
  ViewUserDrawer,
} from './components';
import { useUserOperations } from './hooks/useUserOperations';

/**
 * 用户管理页面
 */
const UserManage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const {
    handleAdd,
    handleGetUserInfo,
    handleUpdate,
    handleDelete,
    handleResetPassword,
    handleBanOrUnban,
  } = useUserOperations();

  // 状态管理
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [viewDrawerVisible, setViewDrawerVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<API.User | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<API.User | null>(null);
  const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<API.CurrentUser | null>(null);

  /**
   * 查看用户详情
   */
  const handleViewUser = async (record: API.CurrentUser) => {
    const userData = await handleGetUserInfo(record.id);
    if (userData) {
      setCurrentUser(userData);
      setViewDrawerVisible(true);
    }
  };

  /**
   * 编辑用户
   */
  const handleEditUser = async (record: API.CurrentUser) => {
    const userData = await handleGetUserInfo(record.id);
    if (userData) {
      setEditingUser(userData);
      setEditModalVisible(true);
    }
  };

  /**
   * 重置密码
   */
  const handleResetPasswordClick = (record: API.CurrentUser) => {
    setResetPasswordUser(record);
    setResetPasswordModalVisible(true);
  };

  /**
   * 删除用户
   */
  const handleDeleteUser = async (record: API.CurrentUser) => {
    const success = await handleDelete(record.id);
    if (success) {
      actionRef.current?.reload();
    }
  };

  /**
   * 封禁或解禁用户
   */
  const handleBanOrUnbanUser = async (record: API.CurrentUser) => {
    const success = await handleBanOrUnban(record.id, record.userStatus);
    if (success) {
      actionRef.current?.reload();
    }
  };

  /**
   * 添加用户完成
   */
  const handleAddFinish = async (values: API.AdminAddUserParams) => {
    const success = await handleAdd(values);
    if (success) {
      setCreateModalVisible(false);
      actionRef.current?.reload();
    }
    return success;
  };

  /**
   * 编辑用户完成
   */
  const handleUpdateFinish = async (values: API.AdminUpdateUserInfoParams) => {
    const success = await handleUpdate(values);
    if (success) {
      setEditModalVisible(false);
      setEditingUser(null);
      actionRef.current?.reload();
    }
    return success;
  };

  /**
   * 重置密码完成
   */
  const handleResetPasswordFinish = async (values: { newPassword: string }) => {
    if (!resetPasswordUser) return false;

    const success = await handleResetPassword(resetPasswordUser.id, values.newPassword);
    if (success) {
      setResetPasswordModalVisible(false);
      setResetPasswordUser(null);
    }
    return success;
  };

  // 获取表格列定义
  const columns = getUserTableColumns({
    onView: handleViewUser,
    onEdit: handleEditUser,
    onResetPassword: handleResetPasswordClick,
    onBanOrUnban: handleBanOrUnbanUser,
    onDelete: handleDeleteUser,
  });

  return (
    <PageContainer
      header={{
        title: '用户管理',
        subTitle: '管理系统中的所有用户信息',
        breadcrumb: {},
      }}
    >
      <ProTable<API.CurrentUser>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort) => {
          try {
            // 构建请求参数
            const requestParams: API.AdminQueryUserParams = {
              current: params.current || 1,
              pageSize: params.pageSize || 10,
            };

            // 精确匹配字段
            if (params.userAccount) requestParams.userAccount = params.userAccount;
            if (params.userRole) requestParams.userRole = params.userRole;
            if (params.userGender !== undefined) requestParams.userGender = params.userGender;
            if (params.userPhone) requestParams.userPhone = params.userPhone;
            if (params.userEmail) requestParams.userEmail = params.userEmail;
            if (params.userStatus !== undefined) requestParams.userStatus = params.userStatus;
            if (params.planetCode) requestParams.planetCode = params.planetCode;

            // 模糊搜索字段
            if (params.userName) requestParams.userName = params.userName;
            if (params.userProfile) requestParams.userProfile = params.userProfile;

            // 时间范围查询
            if (params.createTimeStart) {
              requestParams.createTimeStart = params.createTimeStart;
            }
            if (params.createTimeEnd) {
              requestParams.createTimeEnd = params.createTimeEnd;
            }

            // 排序参数 - 修复排序字段映射
            if (sort && Object.keys(sort).length > 0) {
              const sortField = Object.keys(sort)[0];
              const sortOrder = sort[sortField];

              // 将前端字段映射到后端字段
              const fieldMapping: Record<string, string> = {
                userAccount: 'user_account',
                userName: 'user_name',
                userPhone: 'user_phone',
                userEmail: 'user_email',
                planetCode: 'planet_code',
                createTime: 'create_time',
              };

              requestParams.sortField = fieldMapping[sortField] || sortField;
              // 确保 sortOrder 是 'ascend' 或 'descend'
              if (sortOrder === 'ascend' || sortOrder === 'descend') {
                requestParams.sortOrder = sortOrder;
              }
            }

            // 调用后端分页接口
            const userPage = await adminGetUserInfoByPage(requestParams);
            const pageData = userPage || { records: [], total: 0 };

            // 类型映射
            const mappedData: API.CurrentUser[] = (pageData.records || []).map(
              (user: API.UserVO) => ({
                ...user,
                editTime: user.createTime,
                updateTime: user.createTime,
              }),
            );

            return {
              data: mappedData,
              success: true,
              total: pageData.total || 0,
            };
          } catch (error) {
            console.error('获取用户列表失败:', error);
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columnsState={{
          persistenceKey: 'user-manage-table',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          defaultCollapsed: false,
          optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
          reload: true,
          density: true,
        }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
          pageSizeOptions: ['5', '10', '20', '50', '100'],
        }}
        dateFormatter="string"
        headerTitle={
          <Space>
            <TeamOutlined style={{ fontSize: '20px', color: '#1677ff' }} />
            <span style={{ fontSize: '16px', fontWeight: '500' }}>用户列表</span>
          </Space>
        }
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setCreateModalVisible(true)}
          >
            新建用户
          </Button>,
        ]}
        style={{
          borderRadius: '12px',
        }}
        scroll={{ x: 1300 }}
      />

      {/* 添加用户弹窗 */}
      <CreateUserModal
        visible={createModalVisible}
        onVisibleChange={setCreateModalVisible}
        onFinish={handleAddFinish}
      />

      {/* 编辑用户弹窗 */}
      <EditUserModal
        visible={editModalVisible}
        editingUser={editingUser}
        onVisibleChange={(visible) => {
          setEditModalVisible(visible);
          if (!visible) {
            setEditingUser(null);
          }
        }}
        onFinish={handleUpdateFinish}
      />

      {/* 重置密码弹窗 */}
      <ResetPasswordModal
        visible={resetPasswordModalVisible}
        resetPasswordUser={resetPasswordUser}
        onVisibleChange={(visible) => {
          setResetPasswordModalVisible(visible);
          if (!visible) {
            setResetPasswordUser(null);
          }
        }}
        onFinish={handleResetPasswordFinish}
      />

      {/* 查看用户详情抽屉 */}
      <ViewUserDrawer
        visible={viewDrawerVisible}
        currentUser={currentUser}
        onClose={() => {
          setViewDrawerVisible(false);
          setCurrentUser(null);
        }}
      />
    </PageContainer>
  );
};

export default UserManage;
