// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/**
 * 获取当前登录用户信息
 * 对应后端接口: GET /api/user/get/login
 * @param options 请求配置
 * @returns 当前登录用户信息
 */
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.CurrentUser>('/api/user/loginUserInfo', {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 用户注册
 * 对应后端接口: POST /api/user/register
 * 响应拦截器会自动提取 BaseResponse.data，所以返回类型直接是注册用户的 ID
 * @param body 注册参数
 * @param options 请求配置
 * @returns 新注册用户的 ID
 */
export async function register(body: API.RegisterParams, options?: { [key: string]: any }) {
  return request<API.RegisterResult>('/api/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**
 * 用户登录
 * 对应后端接口: POST /api/user/login
 * 响应拦截器会自动提取 BaseResponse.data，所以返回类型直接是 UserLoginVO
 * @param body 登录参数
 * @param options 请求配置
 * @returns 登录用户信息
 */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**
 * 用户注销
 * 对应后端接口: POST /api/user/logout
 * @param options 请求配置
 * @returns 注销结果
 */
export async function outLogin(options?: { [key: string]: any }) {
  return request<boolean>('/api/user/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/**
 * 更新用户信息
 * 对应后端接口: POST /api/user/updateUserInfo
 * @param body 更新参数
 * @param options 请求配置
 * @returns 更新结果
 */
export async function updateUserInfo(
  body: API.UpdateUserInfoParams,
  options?: { [key: string]: any },
) {
  return request<boolean>('/api/user/updateUserInfo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**
 * 更新用户密码
 * 对应后端接口: POST /api/user/updatePassword
 * @param body 更新密码参数
 * @param options 请求配置
 * @returns 更新结果
 */
export async function updateUserPassword(
  body: API.UpdatePasswordParams,
  options?: { [key: string]: any },
) {
  return request<boolean>('/api/user/updatePassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
