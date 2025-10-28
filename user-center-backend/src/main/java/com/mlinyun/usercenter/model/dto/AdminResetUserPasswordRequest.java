package com.mlinyun.usercenter.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.io.Serial;
import java.io.Serializable;
import lombok.Data;

/**
 * 管理员重置用户密码请求体
 *
 * <p>
 * 用于管理员重置用户密码的请求参数
 * </p>
 */
@Data
@Schema(description = "管理员重置用户密码请求体")
public class AdminResetUserPasswordRequest implements Serializable {

    /**
     * 序列化版本号
     */
    @Serial
    private static final long serialVersionUID = 6647837166720762450L;

    /**
     * 用户 ID
     */
    @Schema(description = "用户 ID", example = "1899878538809757698", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "用户ID不能为空")
    @PositiveOrZero(message = "id 不能小于 0")
    private Long id;

    /**
     * 新的密码
     */
    @Schema(description = "新的密码", example = "Password..4321", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "新密码不能为空")
    @Size(min = 8, max = 20, message = "新密码长度必须在8-20位之间")
    private String newPassword;

}
