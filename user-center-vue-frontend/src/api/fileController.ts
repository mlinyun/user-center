import request from "@/libs/request";

/** 上传头像 上传用户头像文件（需要登录） POST /file/upload/avatar */
export async function uploadAvatar(body: object, options?: { [key: string]: any }) {
    return request<API.BaseResponseString>("/file/upload/avatar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...options,
    });
}
