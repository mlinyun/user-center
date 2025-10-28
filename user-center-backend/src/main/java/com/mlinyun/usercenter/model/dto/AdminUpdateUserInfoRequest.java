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
 * 管理员更新用户信息请求体
 *
 * <p>
 * 用于管理员更新用户信息的请求参数
 * </p>
 */
@Data
@Schema(description = "管理员更新用户信息请求体")
public class AdminUpdateUserInfoRequest implements Serializable {

    /**
     * 序列化版本号
     */
    @Serial
    private static final long serialVersionUID = -6846762918203886972L;

    /**
     * 用户 ID
     */
    @Schema(description = "用户 ID", example = "1899878538809757698", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "用户 ID 不能为空")
    @PositiveOrZero(message = "ID 不能小于 0")
    private Long id;

    /**
     * 登录密码
     */
    @Schema(description = "登录密码", example = "Password..1234")
    @Size(min = 8, max = 20, message = "登录密码长度必须在8-20位之间")
    private String userPassword;

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
     * 用户角色：admin/user
     */
    @Schema(description = "用户角色", example = "user", defaultValue = "user", allowableValues = {"user", "admin"})
    @Pattern(regexp = "^(?:user|admin)$", message = "用户角色只能为 user 或 admin")
    private String userRole;

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
