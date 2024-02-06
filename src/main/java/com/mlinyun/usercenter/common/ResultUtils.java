package com.mlinyun.usercenter.common;

/**
 * 返回工具类
 */
public class ResultUtils {

    /**
     * 业务执行成功
     *
     * @param data 返回的数据
     * @param <T>  泛型
     * @return 通用返回类-Ok
     */
    public static <T> BaseResponse<T> success(T data, String description) {
        return new BaseResponse<>(0, data, "Ok", description);
    }

    /**
     * 业务执行失败
     *
     * @param errorCode 错误码
     * @return 通用返回类-Fail
     */
    public static BaseResponse error(ErrorCode errorCode) {
        return new BaseResponse<>(errorCode);
    }

    /**
     * 业务执行失败
     *
     * @param code
     * @param message
     * @param description
     * @return
     */
    public static BaseResponse error(int code, String message, String description) {
        return new BaseResponse(code, null, message, description);
    }

    /**
     * 业务执行失败
     *
     * @param errorCode
     * @param message
     * @param description
     * @return
     */
    public static BaseResponse error(ErrorCode errorCode, String message, String description) {
        return new BaseResponse(errorCode.getCode(), null, message, description);
    }

    /**
     * 业务执行失败
     *
     * @param errorCode
     * @param description
     * @return
     */
    public static BaseResponse error(ErrorCode errorCode, String description) {
        return new BaseResponse(errorCode.getCode(), errorCode.getMessage(), description);
    }
}
