declare namespace API {
    /**
     * 通用响应类型
     */
    type BaseResponse<T = unknown> = {
        /** 响应是否成功 */
        success?: boolean;
        /** 响应状态码 */
        code: number;
        /** 响应消息 */
        message?: string;
        /** 响应数据 */
        data?: T;
    };

    /**
     * 通用字符串响应类型
     * 健康检查响应类型
     * 上传头像响应类型
     */
    type BaseResponseString = {
        /** 响应是否成功 */
        success?: true | false;
        /** 响应状态码 */
        code: number;
        /** 响应消息 */
        message?: string;
        data?: string;
    };

    /**
     * 用户注册请求类型
     */
    type UserRegisterRequest = {
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
     * 通用数值响应类型
     * 用户注册响应类型
     * 管理员添加用户响应类型
     */
    type BaseResponseLong = {
        /** 响应是否成功 */
        success?: true | false;
        /** 响应状态码 */
        code: number;
        /** 响应消息 */
        message?: string;
        data?: number;
    };

    /**
     * 用户登录请求类型
     */
    type UserLoginRequest = {
        /** 登录账号 */
        userAccount: string;
        /** 登录密码 */
        userPassword: string;
    };

    /**
     * 用户登录视图对象类型
     */
    type UserLoginVO = {
        /** 用户 ID */
        id?: number;
        /** 登录账号 */
        userAccount?: string;
        /** 用户昵称 */
        userName?: string;
        /** 用户头像 */
        userAvatar?: string;
        /** 用户简介 */
        userProfile?: string;
        /** 用户角色 */
        userRole?: "user" | "admin";
        /** 性别（0女 1男 2未知） */
        userGender?: 0 | 1 | 2;
        /** 手机号 */
        userPhone?: string;
        /** 邮箱地址 */
        userEmail?: string;
        /** 星球编号 */
        planetCode?: string;
        /** 编辑时间 */
        editTime?: string;
        /** 创建时间 */
        createTime?: string;
        /** 更新时间 */
        updateTime?: string;
    };

    /**
     * 用户登录响应类型
     */
    type BaseResponseUserLoginVO = {
        /** 响应是否成功 */
        success?: true | false;
        /** 响应状态码 */
        code: number;
        /** 响应消息 */
        message?: string;
        data?: UserLoginVO;
    };

    /**
     * 更新用户信息请求类型
     */
    type UserUpdateInfoRequest = {
        /** 用户 ID */
        id: number;
        /** 用户昵称 */
        userName?: string;
        /** 用户头像 */
        userAvatar?: string;
        /** 用户简介 */
        userProfile?: string;
        /** 性别（0女 1男 2未知） */
        userGender?: 0 | 1 | 2;
        /** 手机号 */
        userPhone?: string;
        /** 邮箱地址 */
        userEmail?: string;
    };

    /**
     * 用户更新密码请求类型
     */
    type UserUpdatePasswordRequest = {
        /** 用户 ID */
        id: number;
        /** 原始密码 */
        rawPassword: string;
        /** 新的密码 */
        newPassword: string;
        /** 校验密码 */
        checkPassword: string;
    };

    /**
     * 通用布尔响应类型
     * 更新用户信息响应类型
     * 用户更新密码响应类型
     * 用户注销响应类型
     * 管理员更新用户信息响应类型
     * 管理员根据 id 删除用户响应类型
     * 管理员封禁或解封用户响应类型
     * 管理员重置用户密码响应类型
     */
    type BaseResponseBoolean = {
        /** 响应是否成功 */
        success?: true | false;
        /** 响应状态码 */
        code: number;
        /** 响应消息 */
        message?: string;
        data?: boolean;
    };

    /**
     * 管理员查询用户请求类型
     */
    type AdminQueryUserRequest = {
        /** 当前页码 */
        current?: number;
        /** 每页记录数 */
        pageSize?: number;
        /** 排序字段 */
        sortField?: string;
        /** 排序方式 */
        sortOrder?: "ascend" | "descend";
        /** 用户 ID */
        id?: number;
        /** 登录账号 */
        userAccount?: string;
        /** 用户昵称 */
        userName?: string;
        /** 用户简介 */
        userProfile?: string;
        /** 用户角色 */
        userRole?: "user" | "admin";
        /** 性别（0女 1男 2未知） */
        userGender?: 0 | 1 | 2;
        /** 手机号 */
        userPhone?: string;
        /** 邮箱地址 */
        userEmail?: string;
        /** 状态（0正常 1封禁） */
        userStatus?: 0 | 1;
        /** 星球编号 */
        planetCode?: string;
        /** 创建起始时间 */
        createTimeStart?: string;
        /** 创建结束时间 */
        createTimeEnd?: string;
    };

    /**
     * 用户视图对象类型
     */
    type UserVO = {
        /** 用户 ID */
        id?: number;
        /** 登录账号 */
        userAccount?: string;
        /** 用户昵称 */
        userName?: string;
        /** 用户头像URL */
        userAvatar?: string;
        /** 用户简介 */
        userProfile?: string;
        /** 用户角色 */
        userRole?: "user" | "admin";
        /** 性别（0女 1男 2未知） */
        userGender?: 0 | 1 | 2;
        /** 手机号 */
        userPhone?: string;
        /** 邮箱地址 */
        userEmail?: string;
        /** 状态（0正常 1封禁） */
        userStatus?: 0 | 1;
        /** 星球编号 */
        planetCode?: string;
        /** 创建时间 */
        createTime?: string;
    };

    /**
     * 排序项类型
     */
    type OrderItem = {
        column?: string;
        asc?: boolean;
    };

    /**
     * 通用分页用户类型
     */
    type PageUserVO = {
        records?: UserVO[];
        total?: number;
        size?: number;
        current?: number;
        orders?: OrderItem[];
        optimizeCountSql?: PageUserVO;
        searchCount?: PageUserVO;
        optimizeJoinOfCountSql?: boolean;
        maxLimit?: number;
        countId?: string;
        pages?: number;
    };

    /**
     * 通用分页用户响应类型
     */
    type BaseResponsePageUserVO = {
        /** 响应是否成功 */
        success?: true | false;
        /** 响应状态码 */
        code: number;
        /** 响应消息 */
        message?: string;
        data?: PageUserVO;
    };

    /**
     * 管理员添加用户请求类型
     */
    type AdminAddUserRequest = {
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
        /** 用户角色 */
        userRole?: "user" | "admin";
        /** 性别（0女 1男 2未知） */
        userGender?: 0 | 1 | 2;
        /** 手机号 */
        userPhone?: string;
        /** 邮箱地址 */
        userEmail?: string;
        /** 星球编号 */
        planetCode: string;
    };

    /**
     * 管理员根据 ID 获取或删除用户请求类型
     */
    type AdminGetOrDeleteUserRequest = {
        /** 用户 ID */
        id: number;
    };

    /**
     * 用户实体类型
     */
    type User = {
        /** 用户主键 ID */
        id?: number;
        /** 登录账号 */
        userAccount?: string;
        /** 登录密码 */
        userPassword?: string;
        /** 用户昵称 */
        userName?: string;
        /** 用户头像URL */
        userAvatar?: string;
        /** 用户简介 */
        userProfile?: string;
        /** 用户角色 */
        userRole?: "user" | "admin";
        /** 性别（0女 1男 2未知） */
        userGender?: 0 | 1 | 2;
        /** 手机号 */
        userPhone?: string;
        /** 邮箱地址 */
        userEmail?: string;
        /** 状态（0正常 1封禁） */
        userStatus?: 0 | 1;
        /** 星球编号 */
        planetCode?: string;
        /** 编辑时间 */
        editTime?: string;
        /** 创建时间 */
        createTime?: string;
        /** 更新时间 */
        updateTime?: string;
        /** 逻辑删除 */
        isDelete?: number;
    };

    /**
     * 通用用户响应类型
     * 管理员根据 id 获取用户信息响应类型
     */
    type BaseResponseUser = {
        /** 响应是否成功 */
        success?: true | false;
        /** 响应状态码 */
        code: number;
        /** 响应消息 */
        message?: string;
        data?: User;
    };

    /**
     * 管理员更新用户信息请求类型
     */
    type AdminUpdateUserInfoRequest = {
        /** 用户 ID */
        id: number;
        /** 登录密码 */
        userPassword?: string;
        /** 用户昵称 */
        userName?: string;
        /** 用户头像 */
        userAvatar?: string;
        /** 用户简介 */
        userProfile?: string;
        /** 用户角色 */
        userRole?: "user" | "admin";
        /** 性别（0女 1男 2未知） */
        userGender?: 0 | 1 | 2;
        /** 手机号 */
        userPhone?: string;
        /** 邮箱地址 */
        userEmail?: string;
    };

    /**
     * 管理员封禁或解封用户请求类型
     */
    type AdminBanOrUnbanUserRequest = {
        /** 用户 ID */
        id: number;
        /** 状态（0正常 1封禁） */
        userStatus: 0 | 1;
    };

    /**
     * 管理员重置用户密码请求类型
     */
    type AdminResetUserPasswordRequest = {
        /** 用户 ID */
        id: number;
        /** 新的密码 */
        newPassword: string;
    };
}
