package com.mlinyun.usercenter.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.io.Serial;
import java.io.Serializable;
import lombok.Data;

/**
 * 管理员添加用户请求体
 *
 * <p>
 * 用于管理员添加用户的请求参数
 * </p>
 */
@Data
@Schema(description = "管理员添加用户请求体")
public class AdminAddUserRequest implements Serializable {

    /**
     * 序列化版本号
     */
    @Serial
    private static final long serialVersionUID = 43137771053288960L;

    /**
     * 登录账号
     */
    @Schema(description = "登录账号", example = "admin")
    @NotBlank(message = "登陆账号不能为空")
    @Size(min = 4, max = 16, message = "登录账号长度必须在4-16位之间")
    @Pattern(regexp = "^\\w+$", message = "登录账号只能包含字母、数字和下划线")
    private String userAccount;

    /**
     * 登录密码
     */
    @Schema(description = "登录密码", example = "Password..1234")
    @NotBlank(message = "登录密码不能为空")
    @Size(min = 8, max = 20, message = "登录密码长度必须在8-20位之间")
    private String userPassword;

    /**
     * 校验密码
     */
    @Schema(description = "校验密码", example = "Password..1234")
    @NotBlank(message = "校验密码不能为空")
    @Size(min = 8, max = 20, message = "校验密码长度必须在8-20位之间")
    private String checkPassword;

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

    /**
     * 星球编号
     */
    @Schema(description = "星球编号", example = "00001")
    @NotBlank(message = "星球编号不能为空")
    @Size(max = 6, message = "星球编号长度不能超过6位")
    private String planetCode;

}
