// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/**
 * 管理员添加用户
 * 对应后端接口: POST /api/user/addUser
 * @param body 添加用户参数
 * @param options 请求配置
 * @returns 添加用户结果
 */
export async function adminAddUser(body: API.AdminAddUserParams, options?: { [key: string]: any }) {
  return request<API.AdminAddUserResult>('/api/user/addUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**
 * 管理员通过用户 ID 获取用户信息
 * 对应后端接口: POST /api/user/getUserById
 * @param body 用户 ID 参数
 * @param options 请求配置
 * @returns 用户信息
 */
export async function adminGetUserInfoById(
  body: API.AdminGetOrDeleteUserParams,
  options?: { [key: string]: any },
) {
  return request<API.User>('/api/user/getUserById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**
 * 管理员通过用户 ID 删除用户
 * 对应后端接口: POST /api/user/deleteUserById
 * @param body 用户 ID 参数
 * @param options 请求配置
 * @returns 删除结果
 */
export async function adminDeleteUserById(
  body: API.AdminGetOrDeleteUserParams,
  options?: { [key: string]: any },
) {
  return request<boolean>('/api/user/deleteUserById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**
 * 管理员更新用户信息
 * 对应后端接口: POST /api/user/adminUpdateUserInfo
 * @param body 更新用户信息参数
 * @param options 请求配置
 * @returns 更新结果
 */
export async function adminUpdateUserInfo(
  body: API.AdminUpdateUserInfoParams,
  options?: { [key: string]: any },
) {
  return request<boolean>('/api/user/adminUpdateUserInfo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**
 * 管理员分页查询用户列表
 * 对应后端接口: POST /api/user/adminGetUserInfoByPage
 * @param body 分页查询参数
 * @param options 请求配置
 * @returns 分页用户列表
 */
export async function adminGetUserInfoByPage(
  body: API.AdminQueryUserParams,
  options?: { [key: string]: any },
) {
  return request<API.AdminGetUserInfoByPageResult>('/api/user/adminGetUserInfoByPage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**
 * 管理员重置用户密码
 * 对应后端接口: POST /api/user/adminResetUserPassword
 * @param body 重置密码参数
 * @param options 请求配置
 * @returns 重置结果
 */
export async function adminRestUserPassword(
  body: API.AdminResetUserPasswordParams,
  options?: { [key: string]: any },
) {
  return request<boolean>('/api/user/adminResetUserPassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**
 * 管理员封禁或解封用户
 * 对应后端接口: POST /api/user/adminBanOrUnbanUser
 * @param body 封禁或解封参数
 * @param options 请求配置
 * @returns 操作结果
 */
export async function adminBanOrUnbanUser(
  body: API.AdminBanOrUnbanUserParams,
  options?: { [key: string]: any },
) {
  return request<boolean>('/api/user/adminBanOrUnbanUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
