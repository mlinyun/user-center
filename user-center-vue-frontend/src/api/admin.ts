import request from "@/libs/request";
import type { AxiosRequestConfig } from "axios";

/**
 * 管理员分页获取用户列表
 *
 * 按分页条件查询用户列表，支持筛选与排序（管理员权限）
 *
 * @tags 管理员
 * @name adminGetUserInfoByPage
 * @request POST: `/user/adminGetUserInfoByPage`
 * @param body - 管理员查询用户请求，详见 {@link API.AdminQueryUserRequest}（分页与筛选条件）
 * @param [options] - 可选的 Axios 请求配置 {@link AxiosRequestConfig}，用于覆盖请求头或超时等
 * @returns {@link API.BaseResponsePageUserVO} - 返回分页的用户信息列表
 */
export async function adminGetUserInfoByPage(
    body: API.AdminQueryUserRequest,
    options?: AxiosRequestConfig
): Promise<API.BaseResponsePageUserVO> {
    const response = await request<API.BaseResponsePageUserVO>("/user/adminGetUserInfoByPage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...options,
    });
    return response.data;
}

/**
 * 管理员添加用户
 *
 * 管理员添加一个新用户（管理员权限）
 *
 * @tags 管理员
 * @name adminAddUser
 * @request POST: `/user/addUser`
 * @param body - 管理员添加用户的请求体，详见 {@link API.AdminAddUserRequest}（包含用户基本信息）
 * @param [options] - 可选的 Axios 请求配置 {@link AxiosRequestConfig}，用于覆盖请求头或超时等
 * @returns {@link API.BaseResponseLong} - 返回新增用户的 ID（long）
 */
export async function adminAddUser(
    body: API.AdminAddUserRequest,
    options?: AxiosRequestConfig
): Promise<API.BaseResponseLong> {
    const response = await request<API.BaseResponseLong>("/user/addUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...options,
    });
    return response.data;
}

/**
 * 管理员根据 id 获取用户信息
 *
 * 根据用户 id 获取用户详细信息（管理员权限）
 *
 * @tags 管理员
 * @name adminGetUserById
 * @request POST: `/user/getUserById`
 * @param body - 管理员根据 ID 获取或删除用户请求体，详见 {@link API.AdminGetOrDeleteUserRequest}（包含用户 id）
 * @param [options] - 可选的 Axios 请求配置 {@link AxiosRequestConfig}，用于覆盖请求头或超时等
 * @returns {@link API.BaseResponseUser} - 返回用户信息
 */
export async function adminGetUserById(
    body: API.AdminGetOrDeleteUserRequest,
    options?: AxiosRequestConfig
): Promise<API.BaseResponseUser> {
    const response = await request<API.BaseResponseUser>("/user/getUserById", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...options,
    });
    return response.data;
}

/**
 * 管理员更新用户信息
 *
 * 管理员更新指定用户的基本信息（管理员权限）
 *
 * @tags 管理员
 * @name adminUpdateUserInfo
 * @request POST: `/user/adminUpdateUserInfo`
 * @param body - 管理员更新用户信息请求体，详见 {@link API.AdminUpdateUserInfoRequest}（包含需更新的字段）
 * @param [options] - 可选的 Axios 请求配置 {@link AxiosRequestConfig}，用于覆盖请求头或超时等
 * @returns {@link API.BaseResponseBoolean} - 返回操作是否成功
 */
export async function adminUpdateUserInfo(
    body: API.AdminUpdateUserInfoRequest,
    options?: AxiosRequestConfig
): Promise<API.BaseResponseBoolean> {
    const response = await request<API.BaseResponseBoolean>("/user/adminUpdateUserInfo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...options,
    });
    return response.data;
}

/**
 * 管理员根据 id 删除用户
 *
 * 根据用户 id 删除用户（管理员权限）
 *
 * @tags 管理员
 * @name adminDeleteUserById
 * @request POST: `/user/deleteUserById`
 * @param body - 管理员根据 ID 获取或删除用户请求体，详见 {@link API.AdminGetOrDeleteUserRequest}（包含用户 id）
 * @param [options] - 可选的 Axios 请求配置 {@link AxiosRequestConfig}，用于覆盖请求头或超时等
 * @returns {@link API.BaseResponseBoolean} - 返回操作是否成功
 */
export async function adminDeleteUserById(
    body: API.AdminGetOrDeleteUserRequest,
    options?: AxiosRequestConfig
): Promise<API.BaseResponseBoolean> {
    const response = await request<API.BaseResponseBoolean>("/user/deleteUserById", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...options,
    });
    return response.data;
}

/**
 * 管理员封禁或解封用户
 *
 * 管理员对指定用户执行封禁或解封操作。
 *
 * @tags 管理员
 * @name adminBanOrUnbanUser
 * @request POST: `/user/adminBanOrUnbanUser`
 * @param body - 管理员封禁或解封用户请求体，详见 {@link API.AdminBanOrUnbanUserRequest}（包含用户 id 与操作类型）
 * @param [options] - 可选的 Axios 请求配置 {@link AxiosRequestConfig}，用于覆盖请求头或超时等
 * @returns {@link API.BaseResponseBoolean} - 返回操作是否成功
 */
export async function adminBanOrUnbanUser(
    body: API.AdminBanOrUnbanUserRequest,
    options?: AxiosRequestConfig
): Promise<API.BaseResponseBoolean> {
    const response = await request<API.BaseResponseBoolean>("/user/adminBanOrUnbanUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...options,
    });
    return response.data;
}

/**
 * 管理员重置用户密码
 *
 * 管理员重置指定用户的密码为默认或系统生成的密码。
 *
 * @tags 管理员
 * @name adminResetUserPassword
 * @request POST: `/user/adminResetUserPassword`
 * @param body - 管理员重置用户密码请求体，详见 {@link API.AdminResetUserPasswordRequest}（包含用户 id）
 * @param [options] - 可选的 Axios 请求配置 {@link AxiosRequestConfig}，用于覆盖请求头或超时等
 * @returns {@link API.BaseResponseBoolean} - 返回操作是否成功
 */
export async function adminResetUserPassword(
    body: API.AdminResetUserPasswordRequest,
    options?: AxiosRequestConfig
): Promise<API.BaseResponseBoolean> {
    const response = await request<API.BaseResponseBoolean>("/user/adminResetUserPassword", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...options,
    });
    return response.data;
}
