package com.mlinyun.usercenter.common;

import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serial;
import java.io.Serializable;
import lombok.Data;

/**
 * 通用响应类
 *
 * <p>
 * 用于统一接口响应格式，支持泛型，可以返回各种类型的数据
 * </p>
 *
 * @param <T> 响应数据的类型
 */
@Data
@Schema(description = "通用响应类")
public class BaseResponse<T> implements Serializable {

    /**
     * 序列化版本号
     */
    @Serial
    private static final long serialVersionUID = 2683537805305921674L;

    /**
     * 响应是否成功
     */
    @Schema(description = "响应是否成功", example = "true", allowableValues = {"true", "false"})
    private Boolean success;

    /**
     * 响应状态码
     */
    @Schema(description = "响应状态码", example = "20000", defaultValue = "20000",
        requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer code;

    /**
     * 响应消息
     */
    @Schema(description = "响应消息", nullable = true, example = "操作成功")
    private String message;

    /**
     * 响应数据
     */
    @Schema(description = "响应数据", nullable = true)
    private transient T data;

    /**
     * 完整构造函数
     *
     * @param success 响应是否成功
     * @param code 状态码
     * @param message 响应消息
     * @param data 响应数据
     */
    public BaseResponse(Boolean success, Integer code, String message, T data) {
        this.success = success;
        this.code = code;
        this.message = message;
        this.data = data;
    }

    /**
     * 无数据的构造函数
     *
     * @param success 响应是否成功
     * @param code 状态码
     * @param message 响应消息
     */
    public BaseResponse(Boolean success, Integer code, String message) {
        this(success, code, message, null);
    }

    /**
     * 基于结果枚举的构造函数
     *
     * @param resultCodeEnum 结果状态枚举
     */
    public BaseResponse(ResultCodeEnum resultCodeEnum) {
        this(resultCodeEnum.getSuccess(), resultCodeEnum.getCode(), resultCodeEnum.getMessage(), null);
    }

}
