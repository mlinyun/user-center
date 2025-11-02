import request from "@/libs/request";
import type { AxiosRequestConfig } from "axios";

/**
 * 获取登录用户信息
 *
 * 获取当前登录用户的详细信息
 *
 * @tags 用户
 * @name getLoginUserInfo
 * @request GET: `/user/loginUserInfo`
 * @param {AxiosRequestConfig} [options] - Axios 请求配置，可用于覆盖请求头或超时等
 * @return {@link API.BaseResponseUserLoginVO} - 返回包含登录用户信息的响应
 */
export async function getLoginUserInfo(
    options?: AxiosRequestConfig
): Promise<API.BaseResponseUserLoginVO> {
    const response = await request<API.BaseResponseUserLoginVO>("/user/loginUserInfo", {
        method: "GET",
        ...options,
    });
    return response.data;
}

/**
 * 用户注册
 *
 * 用于新用户注册账号
 *
 * @tags 用户
 * @name userRegister
 * @request POST: `/user/register`
 * @param body - 注册请求体，详见 {@link API.UserRegisterRequest}（包含账号、密码、星球编号字段）
 * @param [options] - 可选的 Axios 请求配置 {@link AxiosRequestConfig}，用于覆盖请求头或超时等
 * @returns {@link API.BaseResponseLong} 返回请求结果，返回新建用户的 ID
 */
export async function userRegister(
    body: API.UserRegisterRequest,
    options?: AxiosRequestConfig
): Promise<API.BaseResponseLong> {
    const response = await request<API.BaseResponseLong>("/user/register", {
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
 * 用户登录
 *
 * 用于用户登录系统
 *
 * @tags 用户
 * @name userLogin
 * @request POST: `/user/login`
 * @param body - 登录请求体，详见 {@link API.UserLoginRequest}（包含登陆账号与登陆密码）
 * @param [options] - 可选的 Axios 请求配置 {@link AxiosRequestConfig}，用于覆盖请求头或超时等
 * @returns {@link API.BaseResponseUserLoginVO} 返回包含用户信息的响应
 */
export async function userLogin(
    body: API.UserLoginRequest,
    options?: AxiosRequestConfig
): Promise<API.BaseResponseUserLoginVO> {
    const response = await request<API.BaseResponseUserLoginVO>("/user/login", {
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
 * 更新用户信息
 *
 * 用于更新当前登录用户的个人信息
 *
 * @tags 用户
 * @name updateUserInfo
 * @request POST: `/user/updateUserInfo`
 * @param body - 更新用户信息的请求体，详见 {@link API.UserUpdateInfoRequest}（包含要修改的字段：昵称、头像等））
 * @param [options] - 可选的 Axios 请求配置 {@link AxiosRequestConfig}，用于覆盖请求头或超时等
 * @returns {@link API.BaseResponseBoolean} 返回操作结果，true 表示更新成功，false 表示更新失败
 */
export async function updateUserInfo(
    body: API.UserUpdateInfoRequest,
    options?: AxiosRequestConfig
): Promise<API.BaseResponseBoolean> {
    const response = await request<API.BaseResponseBoolean>("/user/updateUserInfo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...options,
    });
    return response.data;
}

/** 用户重置密码
 *
 * 用于用户更新自己的登录密码
 *
 * @tags 用户
 * @name updateUserPassword
 * @request POST: `/user/updatePassword`
 * @param body - 重置密码请求体，详见 {@link API.UserUpdatePasswordRequest}（包含用户 ID、旧密码和新密码）
 * @param [options] - 可选的 Axios 请求配置 {@link AxiosRequestConfig}，用于覆盖请求头或超时等
 * @returns {@link API.BaseResponseBoolean} 返回操作结果，true 表示密码更新成功，false 表示更新失败
 */
export async function updateUserPassword(
    body: API.UserUpdatePasswordRequest,
    options?: AxiosRequestConfig
): Promise<API.BaseResponseBoolean> {
    const response = await request<API.BaseResponseBoolean>("/user/updatePassword", {
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
 * 用户注销
 *
 * 用于注销当前登录用户的会话
 *
 * @tags 用户
 * @name userLogout
 * @request POST: `/user/logout`
 * @param [options] - 可选的 Axios 请求配置 {@link AxiosRequestConfig}，用于覆盖请求头或超时等
 * @returns {@link API.BaseResponseBoolean} 返回操作结果，true 表示注销成功，false 表示注销失败
 */
export async function userLogout(options?: AxiosRequestConfig): Promise<API.BaseResponseBoolean> {
    const response = await request<API.BaseResponseBoolean>("/user/logout", {
        method: "POST",
        ...options,
    });
    return response.data;
}
