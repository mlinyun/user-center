package com.mlinyun.usercenter.common;

/**
 * 响应结果工具类
 *
 * <p>
 * 提供统一的响应结果创建方法，简化控制器返回结果的构建过程， 支持成功响应和各种错误响应的快速创建
 * </p>
 */
public final class ResultUtils {

    /**
     * 成功状态码：20000
     *
     * <p>
     * 该常量用于表示操作成功的状态码，通常在成功响应中使用
     * </p>
     */
    public static final int SUCCESS_CODE = ResultCodeEnum.SUCCESS.getCode();

    private ResultUtils() {
        // 私有构造函数，防止实例化
        throw new IllegalStateException("Utility class");
    }

    /**
     * 创建成功响应
     *
     * @param data 响应数据
     * @param <T> 响应数据类型
     * @return 包含数据的成功响应对象
     */
    public static <T> BaseResponse<T> success(T data) {
        return new BaseResponse<>(true, SUCCESS_CODE, "成功", data);
    }

    /**
     * 创建错误响应
     *
     * @param code 错误状态码
     * @param message 错误消息
     * @return 包含错误信息的响应对象
     */
    public static BaseResponse<Object> error(int code, String message) {
        return new BaseResponse<>(false, code, message);
    }

    /**
     * 基于结果枚举创建错误响应
     *
     * @param resultCodeEnum 结果状态枚举
     * @return 包含错误信息的响应对象
     */
    public static BaseResponse<Object> error(ResultCodeEnum resultCodeEnum) {
        return new BaseResponse<>(resultCodeEnum);
    }

    /**
     * 基于结果枚举创建自定义消息的错误响应
     *
     * @param resultCodeEnum 结果状态枚举
     * @param message 自定义错误消息
     * @return 包含自定义错误信息的响应对象
     */
    public static BaseResponse<Object> error(ResultCodeEnum resultCodeEnum, String message) {
        return new BaseResponse<>(resultCodeEnum.getSuccess(), resultCodeEnum.getCode(), message, null);
    }

}
