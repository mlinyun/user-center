package com.mlinyun.usercenter.config;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    /**
     * 文件上传配置属性
     */
    private final FileUploadProperties fileUploadProperties;

    /**
     * 构造函数注入文件上传配置属性
     *
     * @param fileUploadProperties 文件上传配置属性
     */
    public StaticResourceConfig(FileUploadProperties fileUploadProperties) {
        this.fileUploadProperties = fileUploadProperties;
    }

    /**
     * 配置静态资源映射
     *
     * @param registry 资源处理器注册表
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 将相对路径转换为绝对路径，使用 Path.toUri().toString() 获取标准的 file:/// 格式
        Path uploadPath = Paths.get(fileUploadProperties.getUploadDir(), fileUploadProperties.getAvatarDir())
            .toAbsolutePath().normalize();
        log.info("uploadPath: {}", uploadPath);
        try {
            // 若目录不存在则创建，避免因缺失目录导致访问异常
            if (Files.notExists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
        } catch (IOException e) {
            // 仅记录并继续使用路径字符串，避免抛出异常阻止上下文初始化
            log.error("无法创建上传目录: {}，原因: {}", uploadPath, e.getMessage());
        }
        String locationPath = uploadPath.toUri().toString();
        log.info("locationPath: {}", locationPath);
        // 添加自定义的静态资源映射，使 upload/avatar/ 目录下的文件可以通过 /file/avatar/** 访问
        registry.addResourceHandler("/file/avatar/**").addResourceLocations(locationPath);
    }

}
