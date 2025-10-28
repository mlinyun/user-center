package com.mlinyun.usercenter.config;

import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 静态资源配置类
 *
 * <p>
 * 用于配置静态资源的映射路径，使得上传的文件可以通过特定的 URL 访问
 * </p>
 */
@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    /**
     * 文件上传目录：通过配置文件注入
     */
    @Value("${file.upload.upload-dir}")
    private String uploadDir;

    @Value("${file.upload.avatar-dir}")
    private String avatarDir;

    /**
     * 配置静态资源映射
     *
     * @param registry 资源处理器注册表
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 将相对路径转换为绝对路径，使用 Path.toUri().toString() 获取标准的 file:/// 格式
        Path uploadPath = Paths.get(uploadDir + "/" + avatarDir).toAbsolutePath().normalize();
        String locationPath = uploadPath.toUri().toString();
        // 添加自定义的静态资源映射，使 upload/avatar/ 目录下的文件可以通过 /file/avatar/** 访问
        registry.addResourceHandler("/file/avatar/**").addResourceLocations(locationPath);
    }

}
