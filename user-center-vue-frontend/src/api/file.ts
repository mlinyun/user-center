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
 * @param file - 头像文件（File 对象）
 * @param [options] - 可选的 Axios 请求配置 {@link AxiosRequestConfig}，用于覆盖请求头或超时等
 * @returns {Promise<string>} - 返回头像 URL 字符串
 */
export async function uploadAvatar(file: File, options?: AxiosRequestConfig): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await request<API.BaseResponseString>("/file/upload/avatar", {
        method: "POST",
        headers: {
            "Content-Type": "multipart/form-data",
        },
        data: formData,
        ...options,
    });

    // 返回头像 URL
    return response.data.data || "";
}
