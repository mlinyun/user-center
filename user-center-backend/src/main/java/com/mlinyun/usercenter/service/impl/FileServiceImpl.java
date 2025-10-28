package com.mlinyun.usercenter.service.impl;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.ObjectUtil;
import com.mlinyun.usercenter.common.ResultCodeEnum;
import com.mlinyun.usercenter.config.FileUploadConfig;
import com.mlinyun.usercenter.constant.ByteConstant;
import com.mlinyun.usercenter.exception.ThrowUtils;
import com.mlinyun.usercenter.service.FileService;
import jakarta.annotation.Resource;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * 文件服务实现类
 *
 * <p>
 * 该类实现了文件上传相关的业务逻辑，包括头像上传功能
 * </p>
 */
@Slf4j
@Service
public class FileServiceImpl implements FileService {

    /**
     * 截取 UUID 的长度
     */
    private static final int UUID_SHORT_LENGTH = 8;

    /**
     * 文件上传配置
     */
    @Resource
    private FileUploadConfig fileUploadConfig;

    /**
     * 上传头像
     *
     * @param file 上传的文件
     * @return 文件访问 URL
     */
    @Override
    public String uploadAvatar(MultipartFile file) {
        // 1. 校验文件
        ThrowUtils.throwIf(ObjectUtil.isEmpty(file), ResultCodeEnum.PARAM_ERROR, "文件不能为空");
        ThrowUtils.throwIf(file.isEmpty(), ResultCodeEnum.PARAM_ERROR, "文件内容为空");

        // 2. 校验文件大小
        long fileSize = file.getSize();
        ThrowUtils.throwIf(fileSize > ByteConstant.DEFAULT_MAX_FILE_SIZE, ResultCodeEnum.PARAM_ERROR,
            "文件大小不能超过 " + (ByteConstant.DEFAULT_MAX_FILE_SIZE / ByteConstant.BYTES_PER_MB) + "MB");

        // 3. 校验文件类型
        String contentType = file.getContentType();
        boolean isValidType = Arrays.asList(fileUploadConfig.getAllowedTypes()).contains(contentType);
        ThrowUtils.throwIf(!isValidType, ResultCodeEnum.PARAM_ERROR, "不支持的文件类型，仅支持 JPG、PNG、GIF 格式");

        // 4. 生成唯一文件名
        String originalFilename = file.getOriginalFilename(); // 获取原始文件名
        String fileExtension = FileUtil.extName(originalFilename); // 获取文件扩展名
        // 生成唯一文件名（使用更安全的UUID + 时间戳方式）
        String dateTimeStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String uuidStr = UUID.randomUUID().toString().replace("-", "").substring(0, UUID_SHORT_LENGTH);
        String uniqueFileName = dateTimeStr + "_" + uuidStr + "." + fileExtension;

        // 5. 构建文件保存路径
        String uploadDir = fileUploadConfig.getUploadDir(); // 获取上传目录
        if (uploadDir == null || uploadDir.trim().isEmpty()) {
            uploadDir = "./uploads";
        }
        String avatarDir = fileUploadConfig.getAvatarDir(); // 获取头像子目录
        // 构建完整的文件保存路径
        Path uploadPath = Paths.get(uploadDir, avatarDir).toAbsolutePath().normalize();
        log.info("文件保存路径: {}", uploadPath.toString());

        // 6. 保存文件到服务器
        try {
            // 确保目录存在
            Files.createDirectories(uploadPath);
            // 保存文件
            Path targetPath = uploadPath.resolve(uniqueFileName);
            log.info("保存文件到路径: {}", targetPath.toString());
            file.transferTo(targetPath.toFile());
        } catch (Exception e) {
            throw new RuntimeException("文件上传失败: " + e.getMessage());
        }

        // 7. 返回文件访问 URL
        return fileUploadConfig.getAccessPrefix() + "/" + avatarDir + "/" + uniqueFileName;
    }

}
