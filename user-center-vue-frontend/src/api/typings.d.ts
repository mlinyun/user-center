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

    type AdminBanOrUnbanUserRequest = {
        /** 用户 ID */
        id: number;
        /** 状态（0正常 1封禁） */
        userStatus: 0 | 1;
    };

    type AdminGetOrDeleteUserRequest = {
        /** 用户 ID */
        id: number;
    };

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

    type AdminResetUserPasswordRequest = {
        /** 用户 ID */
        id: number;
        /** 新的密码 */
        newPassword: string;
    };

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

    type BaseResponseBoolean = {
        /** 响应是否成功 */
        success?: true | false;
        /** 响应状态码 */
        code: number;
        /** 响应消息 */
        message?: string;
        data?: boolean;
    };

    type BaseResponseLong = {
        /** 响应是否成功 */
        success?: true | false;
        /** 响应状态码 */
        code: number;
        /** 响应消息 */
        message?: string;
        data?: number;
    };

    type BaseResponsePageUserVO = {
        /** 响应是否成功 */
        success?: true | false;
        /** 响应状态码 */
        code: number;
        /** 响应消息 */
        message?: string;
        data?: PageUserVO;
    };

    type BaseResponseString = {
        /** 响应是否成功 */
        success?: true | false;
        /** 响应状态码 */
        code: number;
        /** 响应消息 */
        message?: string;
        data?: string;
    };

    type BaseResponseUser = {
        /** 响应是否成功 */
        success?: true | false;
        /** 响应状态码 */
        code: number;
        /** 响应消息 */
        message?: string;
        data?: User;
    };

    type BaseResponseUserLoginVO = {
        /** 响应是否成功 */
        success?: true | false;
        /** 响应状态码 */
        code: number;
        /** 响应消息 */
        message?: string;
        data?: UserLoginVO;
    };

    type OrderItem = {
        column?: string;
        asc?: boolean;
    };

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

    type UserLoginRequest = {
        /** 登录账号 */
        userAccount: string;
        /** 登录密码 */
        userPassword: string;
    };

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
}
