package com.mlinyun.usercenter.common;

import lombok.Getter;

/**
 * 结果状态枚举类
 *
 * <p>
 * 用于定义统一的返回状态码和消息
 * </p>
 */
@Getter
public enum ResultCodeEnum {

    // 200 OK：请求成功
    SUCCESS(true, 20000, "成功"),
    // 400 Bad Request：请求语法错误或请求无效
    PARAM_ERROR(false, 40000, "请求参数错误"),
    // 401 Unauthorized：未授权，需要身份验证
    NOT_LOGIN_ERROR(false, 40100, "未登录"),
    // 401 Unauthorized：无权限访问
    NO_AUTH_ERROR(false, 40101, "无权限"),
    // 403 Forbidden：禁止访问，服务器拒绝请求
    FORBIDDEN_ERROR(false, 40300, "禁止访问"),
    // 404 Not Found：请求的资源不存在
    NOT_FOUND_ERROR(false, 40400, "请求的资源不存在"),
    // 500 Internal Server Error：服务器内部错误
    SERVER_ERROR(false, 50000, "服务器内部错误"), OPERATION_ERROR(false, 50001, "操作失败");

    /**
     * 是否成功
     */
    private final Boolean success;

    /**
     * 状态码
     */
    private final Integer code;

    /**
     * 返回消息
     */
    private final String message;

    /**
     * 构造函数
     *
     * @param success 是否成功
     * @param code 状态码
     * @param message 返回消息
     */
    ResultCodeEnum(Boolean success, Integer code, String message) {
        this.success = success;
        this.code = code;
        this.message = message;
    }

}
