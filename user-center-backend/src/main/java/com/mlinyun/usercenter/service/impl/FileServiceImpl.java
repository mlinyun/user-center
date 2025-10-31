package com.mlinyun.usercenter.service.impl;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.ObjectUtil;
import com.mlinyun.usercenter.common.ResultCodeEnum;
import com.mlinyun.usercenter.config.FileUploadProperties;
import com.mlinyun.usercenter.constant.ByteConstant;
import com.mlinyun.usercenter.exception.ThrowUtils;
import com.mlinyun.usercenter.model.entity.User;
import com.mlinyun.usercenter.service.FileService;
import com.mlinyun.usercenter.service.UserService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import javax.imageio.ImageIO;
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
     * 已支持图片格式的魔数信息，用于进行文件头校验，防止伪造文件
     */
    private static final Map<String,
        List<byte[]>> IMAGE_MAGIC_NUMBERS = Map.of("jpg", List.of(new byte[] {(byte) 0xFF, (byte) 0xD8, (byte) 0xFF}),
            "jpeg", List.of(new byte[] {(byte) 0xFF, (byte) 0xD8, (byte) 0xFF}), "png",
            List.of(new byte[] {(byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A}), "gif",
            List.of("GIF8".getBytes(StandardCharsets.US_ASCII)));

    /**
     * 文件上传配置
     */
    @Resource
    private FileUploadProperties fileUploadProperties;

    /**
     * 用户服务
     */
    @Resource
    private UserService userService;

    /**
     * 上传头像
     *
     * @param file 上传的文件
     * @param request HttpServletRequest 对象
     * @return 文件访问 URL
     */
    @Override
    public String uploadAvatar(MultipartFile file, HttpServletRequest request) {
        // 1. 获取登录用户
        User loginUser = userService.getLoginUser(request);
        ThrowUtils.throwIf(ObjectUtil.isEmpty(loginUser), ResultCodeEnum.NOT_LOGIN_ERROR, "用户未登录");

        // 2. 校验文件
        ThrowUtils.throwIf(ObjectUtil.isEmpty(file), ResultCodeEnum.PARAM_ERROR, "文件不能为空");
        ThrowUtils.throwIf(file.isEmpty(), ResultCodeEnum.PARAM_ERROR, "文件内容为空");

        // 3. 校验文件大小
        long fileSize = file.getSize();
        ThrowUtils.throwIf(fileSize > ByteConstant.DEFAULT_MAX_FILE_SIZE, ResultCodeEnum.PARAM_ERROR,
            "文件大小不能超过 " + (ByteConstant.DEFAULT_MAX_FILE_SIZE / ByteConstant.BYTES_PER_MB) + "MB");

        // 4. 校验文件类型（基于 MIME 类型）
        String contentType = file.getContentType();
        boolean isValidType = Arrays.asList(fileUploadProperties.getAllowedTypes()).contains(contentType);
        ThrowUtils.throwIf(!isValidType, ResultCodeEnum.PARAM_ERROR, "不支持的文件类型，仅支持 JPG、JPEG、PNG、GIF 格式");

        // 5. 记录上传日志
        Long userId = loginUser.getId();
        log.info("用户 [{}] 开始上传头像文件，文件名: {}, 大小: {} bytes, 类型: {}", userId, file.getOriginalFilename(), fileSize,
            contentType);

        // 6. 生成唯一文件名
        String originalFilename = file.getOriginalFilename(); // 获取原始文件名
        String fileExtension = FileUtil.extName(originalFilename); // 获取文件扩展名
        // 校验文件扩展名（防止恶意文件名）
        ThrowUtils.throwIf(fileExtension == null || fileExtension.trim().isEmpty(), ResultCodeEnum.PARAM_ERROR,
            "文件扩展名不合法");
        String lowerExtension = fileExtension.toLowerCase();
        ThrowUtils.throwIf(!Arrays.asList("jpg", "jpeg", "png", "gif").contains(lowerExtension),
            ResultCodeEnum.PARAM_ERROR, "文件扩展名不合法，仅支持 jpg、jpeg、png、gif");

        // 7. 读取文件字节并进行内容校验，防止伪造的图片文件
        byte[] fileBytes = readAllBytes(file);
        validateImageContent(fileBytes, lowerExtension);

        // 生成唯一文件名（使用更安全的UUID + 时间戳方式）
        String dateTimeStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String uuidStr = UUID.randomUUID().toString().replace("-", "").substring(0, UUID_SHORT_LENGTH);
        String uniqueFileName = dateTimeStr + "_" + uuidStr + "." + lowerExtension;

        // 8. 构建文件保存路径
        String uploadDir = fileUploadProperties.getUploadDir(); // 获取上传目录
        if (uploadDir == null || uploadDir.trim().isEmpty()) {
            uploadDir = "./uploads";
        }
        String avatarDir = fileUploadProperties.getAvatarDir(); // 获取头像子目录
        String userIdDir = String.valueOf(userId); // 使用用户 ID 作为子目录
        // 构建完整的文件保存路径
        Path uploadPath = Paths.get(uploadDir, avatarDir, userIdDir).toAbsolutePath().normalize();
        log.info("文件保存路径: {}", uploadPath);

        // 9. 保存文件到服务器
        try {
            // 确保目录存在
            Files.createDirectories(uploadPath);
            // 保存文件
            Path targetPath = uploadPath.resolve(uniqueFileName);
            log.info("用户 [{}] 保存文件到路径: {}", userId, targetPath);
            Files.write(targetPath, fileBytes);
            log.info("用户 [{}] 文件上传成功: {}", userId, uniqueFileName);
        } catch (Exception e) {
            log.error("用户 [{}] 文件上传失败: {}", userId, e.getMessage(), e);
            throw new RuntimeException("文件上传失败: " + e.getMessage());
        }

        // 10. 返回文件访问 URL
        return fileUploadProperties.getAccessPrefix() + "/" + avatarDir + "/" + userIdDir + "/" + uniqueFileName;
    }

    /**
     * 读取文件所有字节
     */
    private byte[] readAllBytes(MultipartFile file) {
        try {
            return file.getBytes();
        } catch (IOException e) {
            log.error("读取上传文件失败: {}", e.getMessage(), e);
            throw new RuntimeException("读取上传文件失败，请稍后重试");
        }
    }

    /**
     * 校验图片是否合法
     */
    private void validateImageContent(byte[] fileBytes, String lowerExtension) {
        ThrowUtils.throwIf(fileBytes.length == 0, ResultCodeEnum.PARAM_ERROR, "文件内容为空");

        // 校验魔数，确认文件头是否与声明的扩展名匹配
        ThrowUtils.throwIf(!matchesMagicNumber(fileBytes, lowerExtension), ResultCodeEnum.PARAM_ERROR,
            "文件内容与扩展名不匹配或不是合法的图片文件");

        // 使用 ImageIO 进一步校验图片是否可被解析
        try (ByteArrayInputStream inputStream = new ByteArrayInputStream(fileBytes)) {
            BufferedImage image = ImageIO.read(inputStream);
            ThrowUtils.throwIf(ObjectUtil.isEmpty(image), ResultCodeEnum.PARAM_ERROR, "图片内容解析失败，可能已损坏");
        } catch (IOException e) {
            log.error("校验图片内容失败: {}", e.getMessage(), e);
            throw new RuntimeException("图片内容校验失败，请稍后重试");
        }
    }

    /**
     * 校验文件头魔数
     */
    private boolean matchesMagicNumber(byte[] fileBytes, String lowerExtension) {
        List<byte[]> signatures = IMAGE_MAGIC_NUMBERS.get(lowerExtension);
        if (signatures == null) {
            return false;
        }
        for (byte[] signature : signatures) {
            if (fileBytes.length < signature.length) {
                continue;
            }
            boolean matched = true;
            for (int i = 0; i < signature.length; i++) {
                if (fileBytes[i] != signature[i]) {
                    matched = false;
                    break;
                }
            }
            if (matched) {
                return true;
            }
        }
        return false;
    }

}
