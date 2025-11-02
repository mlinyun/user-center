import request from "@/libs/request";
import type { AxiosRequestConfig } from "axios";

/**
 * 上传用户头像
 *
 * 上传用户头像文件，返回头像的访问 URL
 *
 * @tags 文件
 * @name uploadAvatar
 * @request POST: `/file/upload/avatar`
 * @param body - 文件请求体，包含头像文件数据
 * @param [options] - 可选的 Axios 请求配置 {@link AxiosRequestConfig}，用于覆盖请求头或超时等
 * @returns {@link API.BaseResponseString} - 返回上传结果，包含头像 URL 字符串
 */
export async function uploadAvatar(
    body: object,
    options?: AxiosRequestConfig
): Promise<API.BaseResponseString> {
    const response = await request<API.BaseResponseString>("/file/upload/avatar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...options,
    });
    return response.data;
}
