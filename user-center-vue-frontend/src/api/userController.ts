import request from "@/libs/request";

/** 管理员添加用户 管理员添加用户接口 POST /user/addUser */
export async function adminAddUser(
    body: API.AdminAddUserRequest,
    options?: { [key: string]: any }
) {
    return request<API.BaseResponseLong>("/user/addUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...options,
    });
}

/** 管理员封禁或解封用户 管理员封禁或解封用户接口 POST /user/adminBanOrUnbanUser */
export async function adminBanOrUnbanUser(
    body: API.AdminBanOrUnbanUserRequest,
    options?: { [key: string]: any }
) {
    return request<API.BaseResponseBoolean>("/user/adminBanOrUnbanUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...options,
    });
}

/** 管理员分页获取用户列表 管理员分页获取用户列表接口 POST /user/adminGetUserInfoByPage */
export async function adminGetUserInfoByPage(
    body: API.AdminQueryUserRequest,
    options?: { [key: string]: any }
) {
    return request<API.BaseResponsePageUserVO>("/user/adminGetUserInfoByPage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...options,
    });
}

/** 管理员重置用户密码 管理员重置用户密码接口 POST /user/adminResetUserPassword */
export async function adminResetUserPassword(
    body: API.AdminResetUserPasswordRequest,
    options?: { [key: string]: any }
) {
    return request<API.BaseResponseBoolean>("/user/adminResetUserPassword", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...options,
    });
}

/** 管理员更新用户信息 管理员更新用户信息接口 POST /user/adminUpdateUserInfo */
export async function adminUpdateUserInfo(
    body: API.AdminUpdateUserInfoRequest,
    options?: { [key: string]: any }
) {
    return request<API.BaseResponseBoolean>("/user/adminUpdateUserInfo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...options,
    });
}

/** 管理员根据 id 删除用户 管理员根据 id 删除用户接口 POST /user/deleteUserById */
export async function adminDeleteUserById(
    body: API.AdminGetOrDeleteUserRequest,
    options?: { [key: string]: any }
) {
    return request<API.BaseResponseBoolean>("/user/deleteUserById", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...options,
    });
}

/** 管理员根据 id 获取用户信息 管理员根据 id 获取用户信息接口 POST /user/getUserById */
export async function adminGetUserById(
    body: API.AdminGetOrDeleteUserRequest,
    options?: { [key: string]: any }
) {
    return request<API.BaseResponseUser>("/user/getUserById", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...options,
    });
}

/** 用户登录 用户登录接口 POST /user/login */
export async function userLogin(body: API.UserLoginRequest, options?: { [key: string]: any }) {
    return request<API.BaseResponseUserLoginVO>("/user/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...options,
    });
}

/** 获取登录用户信息 获取登录用户信息接口 GET /user/loginUserInfo */
export async function getLoginUserInfo(options?: { [key: string]: any }) {
    return request<API.BaseResponseUserLoginVO>("/user/loginUserInfo", {
        method: "GET",
        ...options,
    });
}

/** 用户注销 用户注销接口 POST /user/logout */
export async function userLogout(options?: { [key: string]: any }) {
    return request<API.BaseResponseBoolean>("/user/logout", {
        method: "POST",
        ...options,
    });
}

/** 用户注册 用户注册接口 POST /user/register */
export async function userRegister(
    body: API.UserRegisterRequest,
    options?: { [key: string]: any }
) {
    return request<API.BaseResponseLong>("/user/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...options,
    });
}

/** 用户重置密码 用户重置密码接口 POST /user/updatePassword */
export async function updateUserPassword(
    body: API.UserUpdatePasswordRequest,
    options?: { [key: string]: any }
) {
    return request<API.BaseResponseBoolean>("/user/updatePassword", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...options,
    });
}

/** 更新用户信息 更新用户信息接口 POST /user/updateUserInfo */
export async function updateUserInfo(
    body: API.UserUpdateInfoRequest,
    options?: { [key: string]: any }
) {
    return request<API.BaseResponseBoolean>("/user/updateUserInfo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...options,
    });
}
