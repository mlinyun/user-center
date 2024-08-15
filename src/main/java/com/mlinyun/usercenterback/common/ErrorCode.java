package com.mlinyun.usercenterback.common;

/**
 * 错误码
 */
public enum ErrorCode {

    SUCCESS(0, "Ok", ""), PARAMS_ERROR(40000, "请求参数错误", ""), PARAMS_NULL(40001, "请求参数数据为空", ""), NOT_LOGIN(40100, "用户未登录", ""), NO_AUTH(40101, "用户无权限", ""), SYSTEM_ERROR(50000, "系统内部异常", "");

    /**
     * 状态码
     */
    private final int code;

    /**
     * 状态码信息
     */
    private final String message;


    /**
     * 状态码描述（详情）
     */
    private final String description;

    ErrorCode(int code, String message, String description) {
        this.code = code;
        this.message = message;
        this.description = description;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public String getDescription() {
        return description;
    }

}
