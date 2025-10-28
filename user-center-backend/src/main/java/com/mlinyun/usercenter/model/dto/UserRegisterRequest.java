package com.mlinyun.usercenter.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.io.Serial;
import java.io.Serializable;
import lombok.Data;

/**
 * 用户注册请求体
 *
 * <p>
 * 用于封装用户注册时所需的请求参数
 * </p>
 */
@Data
@Schema(description = "用户注册请求体")
public class UserRegisterRequest implements Serializable {

    /**
     * 序列化版本号
     */
    @Serial
    private static final long serialVersionUID = -5102707989915295382L;

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

    /**
     * 校验密码
     */
    @Schema(description = "校验密码", example = "Password..1234", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "校验密码不能为空")
    @Size(min = 8, max = 20, message = "校验密码长度必须在8-20位之间")
    private String checkPassword;

    /**
     * 星球编号
     */
    @Schema(description = "星球编号", example = "00001", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "星球编号不能为空")
    @Size(max = 6, message = "星球编号长度不能超过6位")
    private String planetCode;

}
