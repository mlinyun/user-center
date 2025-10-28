package com.mlinyun.usercenter.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.io.Serial;
import java.io.Serializable;
import lombok.Data;

/**
 * 用户登录请求体
 *
 * <p>
 * 用于用户登录的请求参数
 * </p>
 */
@Data
@Schema(description = "用户登录请求体")
@JsonIgnoreProperties(ignoreUnknown = true) // 忽略未知字段
public class UserLoginRequest implements Serializable {

    /**
     * 序列化版本号
     */
    @Serial
    private static final long serialVersionUID = 3810663695731088135L;

    /**
     * 登录账号
     */
    @Schema(description = "登录账号", example = "admin", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "登陆账号不能为空")
    @Size(min = 4, max = 16, message = "登录账号长度必须在4-16位之间")
    @Pattern(regexp = "^\\w+$", message = "登录账号只能包含字母、数字和下划线")
    private String userAccount;

    /**
     * 登录密码
     */
    @Schema(description = "登录密码", example = "Password..1234", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "登录密码不能为空")
    @Size(min = 8, max = 20, message = "登录密码长度必须在8-20位之间")
    private String userPassword;

}
