package com.mlinyun.usercenter.model.domain.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * 用户登录请求体
 */
@Schema(description = "用户登录请求体")
@Data
public class UserLoginRequest implements Serializable {

    /**
     * 防止序列化过程中冲突
     */
    @Serial
    private static final long serialVersionUID = 2428441552261962530L;

    /**
     * 用户账号
     */
    @Schema(description = "用户账号")
    private String userAccount;

    /**
     * 用户密码
     */
    @Schema(description = "用户密码")
    private String userPassword;
}
