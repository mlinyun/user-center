package com.mlinyun.usercenter.model.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.mlinyun.usercenter.common.PageRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.io.Serial;
import java.io.Serializable;
import java.util.Date;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 管理员查询用户请求体
 *
 * <p>
 * 用于管理员查询用户的请求参数，包含分页信息和多种筛选条件
 * </p>
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "管理员查询用户请求体")
public class AdminQueryUserRequest extends PageRequest implements Serializable {

    @Serial
    private static final long serialVersionUID = 8672217475025252166L;

    /**
     * 用户 ID
     */
    @Schema(description = "用户 ID", example = "1899878538809757698")
    @PositiveOrZero(message = "ID 不能小于 0")
    private Long id;

    /**
     * 登录账号
     */
    @Schema(description = "登录账号", example = "admin")
    @Size(min = 4, max = 16, message = "登录账号长度必须在4-16位之间")
    @Pattern(regexp = "^\\w+$", message = "登录账号只能包含字母、数字和下划线")
    private String userAccount;

    /**
     * 用户昵称
     */
    @Schema(description = "用户昵称", example = "凌云")
    @Size(max = 20, message = "用户昵称不能超过20个字符")
    private String userName;

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
     * 状态（0正常 1封禁）
     */
    @Schema(description = "状态（0正常 1封禁）", example = "0", defaultValue = "0", allowableValues = {"0", "1"})
    @Min(value = 0, message = "用户状态只能为0或1")
    @Max(value = 1, message = "用户状态只能为0或1")
    private Integer userStatus;

    /**
     * 星球编号
     */
    @Schema(description = "星球编号", example = "00001")
    @Size(max = 6, message = "星球编号长度不能超过6位")
    private String planetCode;

    /**
     * 创建起始时间
     */
    @Schema(description = "创建起始时间", example = "2025-04-01 00:00:00")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTimeStart;

    /**
     * 创建结束时间
     */
    @Schema(description = "创建结束时间", example = "2025-04-30 23:59:59")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTimeEnd;

}
