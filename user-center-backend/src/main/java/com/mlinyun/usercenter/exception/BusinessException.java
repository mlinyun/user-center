package com.mlinyun.usercenter.exception;

import com.mlinyun.usercenter.common.ResultCodeEnum;
import lombok.Getter;

/**
 * 自定义业务异常类
 *
 * <p>
 * 用于处理业务逻辑中的异常情况，继承自 RuntimeException
 * </p>
 */
@Getter
public class BusinessException extends RuntimeException {

    /**
     * 业务异常状态码
     */
    private final Integer code;

    /**
     * 使用自定义的状态码和异常信息构造业务异常
     *
     * @param code 状态码
     * @param message 异常信息
     */
    public BusinessException(Integer code, String message) {
        super(message);
        this.code = code;
    }

    /**
     * 使用预定义的结果枚举类构造业务异常
     *
     * @param resultCodeEnum 结果状态枚举类
     */
    public BusinessException(ResultCodeEnum resultCodeEnum) {
        super(resultCodeEnum.getMessage());
        this.code = resultCodeEnum.getCode();
    }

    /**
     * 使用预定义的结果枚举类和自定义异常信息构造业务异常
     *
     * @param resultCodeEnum 结果状态枚举类
     * @param message 自定义异常信息
     */
    public BusinessException(ResultCodeEnum resultCodeEnum, String message) {
        super(message);
        this.code = resultCodeEnum.getCode();
    }

}
