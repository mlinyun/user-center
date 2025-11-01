import request from "@/libs/request";

/** 健康检查 用于检查系统是否正常运行 GET /health */
export async function health(options?: { [key: string]: any }) {
    return request<API.BaseResponseString>("/health", {
        method: "GET",
        ...options,
    });
}
