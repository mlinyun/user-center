package com.mlinyun.usercenter.model.domain;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
import java.util.Date;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 用户
 *
 * @TableName user
 */
@Schema(description = "用户实体类")
@TableName(value = "user")
@Data
public class User implements Serializable {
    /**
     * id
     */
    @Schema(description = "用户 id")
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 用户昵称
     */
    @Schema(description = "用户昵称")
    private String username;

    /**
     * 用户账号
     */
    @Schema(description = "用户账号")
    private String userAccount;

    /**
     * 用户头像
     */
    @Schema(description = "用户头像")
    private String avatarUrl;

    /**
     * 性别
     */
    @Schema(description = "性别")
    private Integer gender;

    /**
     * 用户密码
     */
    @Schema(description = "用户密码")
    private String userPassword;

    /**
     * 电话
     */
    @Schema(description = "电话")
    private String phone;

    /**
     * 邮箱
     */
    @Schema(description = "邮箱")
    private String email;

    /**
     * 用户状态 0 - 正常
     */
    @Schema(description = "用户状态 0 - 正常")
    private Integer userStatus;

    /**
     * 创建时间
     */
    @Schema(description = "创建时间")
    private Date createTime;

    /**
     * 更新时间
     */
    @Schema(description = "更新时间")
    private Date updateTime;

    /**
     * 是否删除
     */
    @Schema(description = "是否删除")
    @TableLogic // 逻辑删除注解
    private Integer isDelete;

    /**
     * 用户角色 0 - 普通用户 1 - 管理员
     */
    @Schema(description = "用户角色 0 - 普通用户 1 - 管理员")
    private Integer userRole;

    /**
     * 星球编号
     */
    @Schema(description = "星球编号")
    private String planetCode;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}