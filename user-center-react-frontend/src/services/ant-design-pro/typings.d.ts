// @ts-ignore
/* eslint-disable */

declare namespace API {
  /**
   * 后端统一响应结构
   * 与后端 BaseResponse<T> 保持一致
   */
  type BaseResponse<T = any> = {
    /** 请求是否成功 */
    success: boolean;
    /** 业务状态码 */
    code: number;
    /** 响应消息 */
    message: string;
    /** 响应数据 */
    data?: T;
  };

  /**
   * 注册请求参数
   * 与后端 UserRegisterRequest 保持一致
   */
  type RegisterParams = {
    /** 登录账号 */
    userAccount: string;
    /** 登录密码 */
    userPassword: string;
    /** 校验密码 */
    checkPassword: string;
    /** 星球编号 */
    planetCode: string;
  };

  /**
   * 注册接口返回结果
   * 后端返回新注册用户的 ID
   */
  type RegisterResult = string;

  /**
   * 当前登录用户信息
   * 与后端 UserLoginVO 保持一致
   */
  type CurrentUser = {
    /** 用户 ID - 使用字符串避免 JavaScript 大整数精度丢失 */
    id: string;
    /** 登录账号 */
    userAccount: string;
    /** 用户昵称 */
    userName: string;
    /** 用户头像 */
    userAvatar: string;
    /** 用户简介 */
    userProfile: string;
    /** 用户角色: user/admin */
    userRole: string;
    /** 性别: 0女 1男 2未知 */
    userGender: number;
    /** 手机号 */
    userPhone: string;
    /** 邮箱地址 */
    userEmail: string;
    /** 星球编号 */
    planetCode: string;
    /** 用户状态: 0正常 1封禁 */
    userStatus: number;
    /** 编辑时间 */
    editTime: Date;
    /** 创建时间 */
    createTime: Date;
    /** 更新时间 */
    updateTime: Date;
  };

  /**
   * 登录请求参数
   * 与后端 UserLoginRequest 保持一致
   */
  type LoginParams = {
    /** 是否自动登录 */
    autoLogin?: boolean;
    /** 登录账号 */
    userAccount: string;
    /** 登录密码 */
    userPassword: string;
  };

  /**
   * 登录接口返回结果
   * 与后端 UserLoginVO 保持一致
   * 响应拦截器会自动提取 BaseResponse.data，所以直接使用 UserLoginVO 类型
   */
  type LoginResult = CurrentUser;

  /**
   * 更新用户信息请求参数
   * 与后端 UpdateUserRequest 保持一致
   */
  type UpdateUserInfoParams = {
    /** 用户 ID - 字符串类型 */
    id: string;
    /** 用户昵称 */
    userName?: string;
    /** 用户头像 */
    userAvatar?: string;
    /** 用户简介 */
    userProfile?: string;
    /** 性别（0女 1男 2未知） */
    userGender?: number;
    /** 手机号 */
    userPhone?: string;
    /** 邮箱地址 */
    userEmail?: string;
  };

  /**
   * 更新密码参数
   * 与后端 UpdatePasswordRequest 保持一致
   */
  type UpdatePasswordParams = {
    /** 用户 ID - 字符串类型 */
    id: string;
    /** 原始密码 */
    rawPassword: string;
    /** 新的密码 */
    newPassword: string;
    /** 校验密码 */
    checkPassword: string;
  };

  /**
   * 管理员添加用户参数
   * 与后端 AdminAddUserRequest 保持一致
   */
  type AdminAddUserParams = {
    /** 登录账号 */
    userAccount: string;
    /** 登录密码 */
    userPassword: string;
    /** 校验密码 */
    checkPassword: string;
    /** 用户昵称 */
    userName?: string;
    /** 用户头像 */
    userAvatar?: string;
    /** 用户简介 */
    userProfile?: string;
    /** 用户角色: user/admin */
    userRole?: 'user' | 'admin';
    /** 性别: 0女 1男 2未知 */
    userGender?: number;
    /** 手机号 */
    userPhone?: string;
    /** 邮箱地址 */
    userEmail?: string;
    /** 星球编号 */
    planetCode: string;
  };

  /**
   * 管理员添加用户接口返回结果
   * 返回新添加用户的 ID
   */
  type AdminAddUserResult = string;

  /**
   * 管理员获取或删除用户参数
   * 与后端 AdminGetOrDeleteUserRequest 保持一致
   */
  type AdminGetOrDeleteUserParams = {
    /** 用户 ID */
    id: string;
  };

  /**
   * 用户实体对象（管理员根据 id 获取用户信息接口返回结果）
   * 与后端 User 保持一致
   */
  type User = {
    /** 用户 ID - 使用字符串避免 JavaScript 大整数精度丢失 */
    id: string;
    /** 登录账号 */
    userAccount: string;
    /** 用户密码 */
    userPassword: string;
    /** 用户昵称 */
    userName: string;
    /** 用户头像 */
    userAvatar: string;
    /** 用户简介 */
    userProfile: string;
    /** 用户角色: user/admin */
    userRole: string;
    /** 性别: 0女 1男 2未知 */
    userGender: number;
    /** 手机号 */
    userPhone: string;
    /** 邮箱地址 */
    userEmail: string;
    /** 用户状态 */
    userStatus: number;
    /** 星球编号 */
    planetCode: string;
    /** 编辑时间 */
    editTime: Date;
    /** 创建时间 */
    createTime: Date;
    /** 更新时间 */
    updateTime: Date;
    /** 逻辑删除 */
    isDeleted: number;
  };

  /**
   * 管理员更新用户信息参数
   * 与后端 AdminUpdateUserInfoRequest 保持一致
   */
  type AdminUpdateUserInfoParams = {
    /** 用户 ID */
    id: string;
    /** 用户密码 */
    userPassword?: string;
    /** 用户昵称 */
    userName?: string;
    /** 用户头像 */
    userAvatar?: string;
    /** 用户简介 */
    userProfile?: string;
    /** 用户角色: user/admin */
    userRole?: string;
    /** 性别: 0女 1男 2未知 */
    userGender?: number;
    /** 手机号 */
    userPhone?: string;
    /** 邮箱地址 */
    userEmail?: string;
  };

  /**
   * 管理员分页查询用户参数
   * 与后端 AdminQueryUserRequest 保持一致
   */
  type AdminQueryUserParams = {
    /** 当前页码 */
    current?: number;
    /** 每页显示数量 */
    pageSize?: number;
    /** 排序字段 */
    sortField?: string;
    /** 排序顺序 */
    sortOrder?: 'ascend' | 'descend';
    /** 用户 ID（搜索） */
    id?: string;
    /** 用户账号（精确匹配） */
    userAccount?: string;
    /** 用户名（模糊搜索） */
    userName?: string;
    /** 用户简介（模糊搜索） */
    userProfile?: string;
    /** 用户角色（筛选） */
    userRole?: string;
    /** 性别（筛选） */
    userGender?: number;
    /** 手机号（精确匹配） */
    userPhone?: string;
    /** 邮箱地址（精确匹配） */
    userEmail?: string;
    /** 用户状态（筛选） */
    userStatus?: number;
    /** 星球编号（精确匹配） */
    planetCode?: string;
    /** 创建时间起始（搜索） */
    createTimeStart?: string;
    /** 创建时间结束（搜索） */
    createTimeEnd?: string;
  };

  /**
   * 用户视图对象
   * 与后端 UserVO 保持一致
   */
  type UserVO = {
    /** 用户 ID */
    id: string;
    /** 登录账号 */
    userAccount: string;
    /** 用户昵称 */
    userName: string;
    /** 用户头像 */
    userAvatar: string;
    /** 用户简介 */
    userProfile: string;
    /** 用户角色: user/admin */
    userRole: 'user' | 'admin';
    /** 性别: 0女 1男 2未知 */
    userGender: number;
    /** 手机号 */
    userPhone: string;
    /** 邮箱地址 */
    userEmail: string;
    /** 用户状态 */
    userStatus: number;
    /** 星球编号 */
    planetCode: string;
    /** 创建时间 */
    createTime: Date;
  };

  /**
   * 管理员分页查询用户接口返回结果
   * 与后端 Page<UserVO> 保持一致
   */
  type AdminGetUserInfoByPageResult = {
    /** 用户记录列表 */
    records: UserVO[];
    /** 总记录数 */
    total: number;
    /** 每页显示数量 */
    size: number;
    /** 当前页码 */
    current: number;
    /** 总页数 */
    pages: number;
  };

  /**
   * 管理员重置用户密码参数
   * 与后端 AdminResetUserPasswordRequest 保持一致
   */
  type AdminResetUserPasswordParams = {
    /** 用户 ID */
    id: string;
    /** 新密码 */
    newPassword: string;
  };

  /**
   * 管理员封禁或解封用户参数
   * 与后端 AdminBanOrUnbanUserRequest 保持一致
   */
  type AdminBanOrUnbanUserParams = {
    /** 用户 ID */
    id: string;
    /** 用户状态，1-正常，0-封禁 */
    userStatus: number;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}
