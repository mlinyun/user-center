package com.mlinyun.usercenter.aop;

import cn.hutool.core.util.StrUtil;
import com.mlinyun.usercenter.annotation.RateLimit;
import com.mlinyun.usercenter.common.ResultCodeEnum;
import com.mlinyun.usercenter.exception.BusinessException;
import com.mlinyun.usercenter.model.entity.User;
import com.mlinyun.usercenter.service.UserService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * 限流拦截器
 *
 * <p>
 * 使用 AOP 实现接口访问频率限制，支持基于用户 ID 和 IP 地址的限流
 * </p>
 */
@Slf4j
@Aspect
@Component
public class RateLimitInterceptor {

    /**
     * 毫秒转换常量
     */
    private static final long MILLIS_PER_SECOND = 1000L;

    /**
     * 用户服务
     */
    @Resource
    private UserService userService;

    /**
     * 限流计数器：key = limitKey, value = [count, expireTime] 使用内存存储，生产环境建议使用 Redis
     */
    private final Map<String, RateLimitInfo> rateLimitMap = new ConcurrentHashMap<>();

    /**
     * 限流信息类
     */
    private static class RateLimitInfo {

        /**
         * 请求计数
         */
        AtomicInteger count;

        /**
         * 过期时间戳（毫秒）
         */
        long expireTime;

        RateLimitInfo(int initialCount, long expireTime) {
            this.count = new AtomicInteger(initialCount);
            this.expireTime = expireTime;
        }

    }

    /**
     * 环绕通知，处理带有 @RateLimit 注解的方法
     *
     * @param joinPoint 切入点
     * @param rateLimit 限流注解
     * @return 方法执行结果
     * @throws Throwable 可能抛出的异常
     */
    @Around("@annotation(rateLimit)")
    public Object doRateLimit(ProceedingJoinPoint joinPoint, RateLimit rateLimit) throws Throwable {
        // 1. 获取请求信息
        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
        if (requestAttributes == null) {
            throw new BusinessException(ResultCodeEnum.SERVER_ERROR, "请求上下文不存在");
        }
        HttpServletRequest request = ((ServletRequestAttributes) requestAttributes).getRequest();

        // 2. 构建限流 Key
        String limitKey = buildLimitKey(request, rateLimit);

        // 3. 执行限流检查
        checkRateLimit(limitKey, rateLimit);

        // 4. 通过限流检查，执行目标方法
        return joinPoint.proceed();
    }

    /**
     * 构建限流 Key
     *
     * @param request HTTP 请求对象
     * @param rateLimit 限流注解
     * @return 限流 Key
     */
    private String buildLimitKey(HttpServletRequest request, RateLimit rateLimit) {
        String methodName = request.getRequestURI();

        if (rateLimit.limitType() == RateLimit.LimitType.USER) {
            // 基于用户 ID 限流
            try {
                User loginUser = userService.getLoginUser(request);
                if (loginUser != null && loginUser.getId() != null) {
                    return "rate_limit:user:" + loginUser.getId() + ":" + methodName;
                }
            } catch (Exception e) {
                log.warn("获取登录用户失败，降级为 IP 限流: {}", e.getMessage());
            }
            // 如果获取用户失败，降级为 IP 限流
            return "rate_limit:ip:" + getClientIp(request) + ":" + methodName;
        } else {
            // 基于 IP 地址限流
            return "rate_limit:ip:" + getClientIp(request) + ":" + methodName;
        }
    }

    /**
     * 执行限流检查
     *
     * @param limitKey 限流 Key
     * @param rateLimit 限流注解
     */
    private void checkRateLimit(String limitKey, RateLimit rateLimit) {
        long currentTime = System.currentTimeMillis();
        int seconds = rateLimit.seconds();
        int maxCount = rateLimit.maxCount();
        long windowTime = seconds * MILLIS_PER_SECOND;

        // 清理过期的限流记录（简单实现，生产环境建议使用定时任务或 Redis 过期机制）
        rateLimitMap.entrySet().removeIf(entry -> entry.getValue().expireTime < currentTime);

        // 获取或创建限流信息
        RateLimitInfo info =
            rateLimitMap.computeIfAbsent(limitKey, k -> new RateLimitInfo(0, currentTime + windowTime));

        // 检查是否过期
        if (info.expireTime < currentTime) {
            // 时间窗口已过期，重置计数器
            info.count.set(0);
            info.expireTime = currentTime + windowTime;
        }

        // 增加计数并检查是否超限
        int currentCount = info.count.incrementAndGet();
        if (currentCount > maxCount) {
            log.warn("限流触发: limitKey={}, currentCount={}, maxCount={}", limitKey, currentCount, maxCount);
            throw new BusinessException(ResultCodeEnum.FORBIDDEN_ERROR,
                "操作过于频繁，请在 " + seconds + " 秒后重试（当前限制：" + maxCount + " 次/" + seconds + "秒）");
        }

        log.debug("限流检查通过: limitKey={}, currentCount={}/{}", limitKey, currentCount, maxCount);
    }

    /**
     * 获取客户端真实 IP 地址
     *
     * @param request HTTP 请求对象
     * @return 客户端 IP
     */
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (StrUtil.isNotBlank(ip) && !"unknown".equalsIgnoreCase(ip)) {
            // 多次反向代理后会有多个 IP 值，第一个为真实 IP
            int index = ip.indexOf(',');
            if (index != -1) {
                return ip.substring(0, index);
            }
            return ip;
        }

        ip = request.getHeader("X-Real-IP");
        if (StrUtil.isNotBlank(ip) && !"unknown".equalsIgnoreCase(ip)) {
            return ip;
        }

        return request.getRemoteAddr();
    }

}
