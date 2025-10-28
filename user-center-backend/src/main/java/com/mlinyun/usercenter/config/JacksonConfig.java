package com.mlinyun.usercenter.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Jackson 配置类
 *
 * <p>
 * 用于配置 Jackson 的 ObjectMapper，使得 Long 类型在序列化时转换为字符串，防止前端精度丢失
 * </p>
 */
@Configuration
public class JacksonConfig {

    /**
     * 配置 Jackson 的 ObjectMapper，使得 Long 类型在序列化时转换为字符串
     *
     * @return 配置好的 ObjectMapper 实例
     */
    @Bean
    public ObjectMapper jacksonObjectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        SimpleModule simpleModule = new SimpleModule();
        // Long 和 long 全部转为字符串
        simpleModule.addSerializer(Long.class, ToStringSerializer.instance);
        simpleModule.addSerializer(Long.TYPE, ToStringSerializer.instance);
        objectMapper.registerModule(simpleModule);
        return objectMapper;
    }

}
