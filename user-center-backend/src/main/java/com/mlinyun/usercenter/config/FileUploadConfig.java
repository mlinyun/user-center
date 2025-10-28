package com.mlinyun.usercenter.config;

import com.mlinyun.usercenter.constant.ByteConstant;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * 文件上传配置类
 *
 * <p>
 * 用于配置文件上传相关的属性
 * </p>
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "file.upload")
public class FileUploadConfig {

    /**
     * 文件上传根目录
     */
    private String uploadDir = "./uploads";

    /**
     * 头像上传目录
     */
    private String avatarDir = "avatar";

    /**
     * 允许的文件类型
     */
    private String[] allowedTypes = {"image/jpeg", "image/png", "image/jpg", "image/gif"};

    /**
     * 最大文件大小（字节）默认 2MB
     */
    private long maxSize = ByteConstant.DEFAULT_MAX_FILE_SIZE;

    /**
     * 访问路径前缀
     */
    private String accessPrefix = "/file";

}
