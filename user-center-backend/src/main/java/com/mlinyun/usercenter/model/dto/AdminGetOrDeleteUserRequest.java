package com.mlinyun.usercenter.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.io.Serial;
import java.io.Serializable;
import lombok.Data;

/**
 * 管理员获取或删除用户请求体
 *
 * <p>
 * 用于管理员获取或删除用户的请求参数
 * </p>
 */
@Data
@Schema(description = "管理员获取或删除用户请求体")
public class AdminGetOrDeleteUserRequest implements Serializable {

    /**
     * 序列化版本号
     */
    @Serial
    private static final long serialVersionUID = 7740738706764737141L;

    /**
     * 用户 ID
     */
    @Schema(description = "用户 ID", example = "1899878538809757698", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "用户 ID 不能为空")
    @PositiveOrZero(message = "ID 不能小于 0")
    private Long id;

}
