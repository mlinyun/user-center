// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/**
 * 上传头像
 * 对应后端接口: POST /api/file/upload/avatar
 * @param file 文件对象
 * @param options 请求配置
 * @returns 文件访问 URL
 */
export async function uploadAvatar(file: File, options?: { [key: string]: any }) {
  const formData = new FormData();
  formData.append('file', file);

  return request<string>('/api/file/upload/avatar', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}
