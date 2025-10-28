package com.mlinyun.usercenter.model.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serial;
import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 * 登录用户信息
 *
 * <p>
 * 用于登录成功后返回给前端的用户信息
 * </p>
 */
@Data
@Schema(description = "登录用户信息视图对象（脱敏）")
public class UserLoginVO implements Serializable {

    /**
     * 序列化版本号
     */
    @Serial
    private static final long serialVersionUID = -1996248651664137739L;

    /**
     * 用户 ID
     */
    @Schema(description = "用户 ID", example = "1899878538809757698")
    // 将 Long 类型序列化为字符串，以防止前端精度丢失
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;

    /**
     * 登录账号
     */
    @Schema(description = "登录账号", example = "admin")
    private String userAccount;

    /**
     * 用户昵称
     */
    @Schema(description = "用户昵称", example = "凌云")
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
    private String userProfile;

    /**
     * 用户角色：user/admin
     */
    @Schema(description = "用户角色", example = "admin", defaultValue = "user", allowableValues = {"user", "admin"})
    private String userRole;

    /**
     * 性别（0女 1男 2未知）
     */
    @Schema(description = "性别（0女 1男 2未知）", example = "2", defaultValue = "2", allowableValues = {"0", "1", "2"})
    private Integer userGender;

    /**
     * 手机号
     */
    @Schema(description = "手机号", example = "13800000000")
    private String userPhone;

    /**
     * 邮箱地址
     */
    @Schema(description = "邮箱地址", example = "user13800@gmail.com")
    private String userEmail;

    /**
     * 星球编号
     */
    @Schema(description = "星球编号", example = "00001")
    private String planetCode;

    /**
     * 编辑时间
     */
    @Schema(description = "编辑时间", example = "2025-04-18 10:41:56")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date editTime;

    /**
     * 创建时间
     */
    @Schema(description = "创建时间", example = "2025-04-18 10:41:56")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;

    /**
     * 更新时间
     */
    @Schema(description = "更新时间", example = "2025-04-18 17:44:25")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updateTime;

}
