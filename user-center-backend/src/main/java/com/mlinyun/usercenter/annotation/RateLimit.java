package com.mlinyun.usercenter.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 限流注解
 *
 * <p>
 * 用于方法级别的访问频率限制，防止恶意刷接口
 * </p>
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RateLimit {

    /**
     * 限流时间窗口（秒）
     */
    int seconds() default 60;

    /**
     * 时间窗口内允许的最大请求次数
     */
    int maxCount() default 10;

    /**
     * 限流类型：IP 或 用户ID
     */
    LimitType limitType() default LimitType.USER;

    /**
     * 限流类型枚举
     */
    enum LimitType {
        /**
         * 根据用户 ID 限流
         */
        USER,
        /**
         * 根据 IP 地址限流
         */
        IP
    }

}
