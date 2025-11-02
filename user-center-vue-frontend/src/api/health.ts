import request from "@/libs/request";
import type { AxiosRequestConfig } from "axios";

/**
 * 健康检查
 *
 * 用于检查系统是否正常运行
 *
 * @tags 健康检查
 * @name health
 * @request GET: `/health`
 * @param [options] - 可选的 Axios 请求配置 {@link AxiosRequestConfig}，用于覆盖请求头或超时等
 * @returns {@link API.BaseResponseString} - 返回健康检查结果字符串
 */
export async function health(options?: AxiosRequestConfig): Promise<API.BaseResponseString> {
    const response = await request<API.BaseResponseString>("/health", {
        method: "GET",
        ...options,
    });
    return response.data;
}
