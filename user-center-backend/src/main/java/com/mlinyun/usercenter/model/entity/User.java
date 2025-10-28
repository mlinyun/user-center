package com.mlinyun.usercenter.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serial;
import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 * 用户实体类
 *
 * <p>
 * 用于数据库操作的实体类，包含用户的基本信息和角色信息
 * </p>
 */
@Schema(description = "用户实体类")
@TableName(value = "user")
@Data
public class User implements Serializable {

    /**
     * 序列化版本号
     */
    @Serial
    @TableField(exist = false)
    private static final long serialVersionUID = 2346879101353130961L;

    /**
     * 用户主键 ID
     */
    @Schema(description = "用户主键 ID", example = "1899878538809757698")
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 登录账号
     */
    @Schema(description = "登录账号", example = "admin")
    private String userAccount;

    /**
     * 登录密码
     */
    @Schema(description = "登录密码", example = "Password..1234")
    private String userPassword;

    /**
     * 用户昵称
     */
    @Schema(description = "用户昵称", example = "凌云")
    private String userName;

    /**
     * 用户头像URL
     */
    @Schema(description = "用户头像URL", example = "https://example.com/avatar.jpg")
    private String userAvatar;

    /**
     * 用户简介
     */
    @Schema(description = "用户简介", example = "一名普通的程序员")
    private String userProfile;

    /**
     * 用户角色：admin/user
     */
    @Schema(description = "用户角色", example = "user", defaultValue = "user", allowableValues = {"user", "admin"})
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
     * 状态（0正常 1封禁）
     */
    @Schema(description = "状态（0正常 1封禁）", example = "0", defaultValue = "0", allowableValues = {"0", "1"})
    private Integer userStatus;

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

    /**
     * 逻辑删除：0未删除，非0删除
     */
    @Schema(description = "逻辑删除", example = "0", defaultValue = "0")
    @TableLogic(value = "0", delval = "UNIX_TIMESTAMP()")
    private Integer isDelete;

}
