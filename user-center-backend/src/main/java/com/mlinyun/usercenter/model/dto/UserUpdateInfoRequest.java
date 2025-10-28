package com.mlinyun.usercenter.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.io.Serial;
import java.io.Serializable;
import lombok.Data;

/**
 * 普通用户更新用户信息请求体
 *
 * <p>
 * 用于普通用户更新其个人信息的请求参数
 * </p>
 */
@Data
@Schema(description = "普通用户更新用户信息请求体")
public class UserUpdateInfoRequest implements Serializable {

    /**
     * 序列化版本号
     */
    @Serial
    private static final long serialVersionUID = -7797114750996470541L;

    /**
     * 用户 ID
     */
    @Schema(description = "用户 ID", example = "1899878538809757698", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "用户 ID 不能为空")
    @PositiveOrZero(message = "ID 不能小于 0")
    private Long id;

    /**
     * 用户昵称
     */
    @Schema(description = "用户昵称", example = "凌云")
    @Size(max = 20, message = "用户昵称不能超过20个字符")
    private String userName;

    /**
     * 用户头像
     */
    @Schema(description = "用户头像", example = "https://example.com/avatar.jpg")
    private String userAvatar;

    /**
     * 用户简介
     */
    @Schema(description = "用户简介", example = "一名普通的程序员")
    @Size(max = 200, message = "用户简介不能超过200个字符")
    private String userProfile;

    /**
     * 性别（0女 1男 2未知）
     */
    @Schema(description = "性别（0女 1男 2未知）", example = "2", defaultValue = "2", allowableValues = {"0", "1", "2"})
    @Min(value = 0, message = "性别只能为0、1或2")
    @Max(value = 2, message = "性别只能为0、1或2")
    private Integer userGender;

    /**
     * 手机号
     */
    @Schema(description = "手机号", example = "13800000000")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String userPhone;

    /**
     * 邮箱地址
     */
    @Schema(description = "邮箱地址", example = "user13800@gmail.com")
    @Email(message = "邮箱格式不正确")
    private String userEmail;

}
