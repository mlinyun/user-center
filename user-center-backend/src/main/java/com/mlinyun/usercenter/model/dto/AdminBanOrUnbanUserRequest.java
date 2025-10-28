package com.mlinyun.usercenter.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.io.Serial;
import java.io.Serializable;
import lombok.Data;

/**
 * 管理员封禁或解封用户请求体
 *
 * <p>
 * 用于管理员封禁或解封用户的请求参数
 * </p>
 */
@Data
@Schema(description = "管理员封禁或解封用户请求体")
public class AdminBanOrUnbanUserRequest implements Serializable {

    /**
     * 序列化版本号
     */
    @Serial
    private static final long serialVersionUID = 1591858465895421729L;

    /**
     * 用户 ID
     */
    @Schema(description = "用户 ID", example = "1899878538809757698", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "用户 ID 不能为空")
    @PositiveOrZero(message = "ID 不能小于 0")
    private Long id;

    /**
     * 状态（0正常 1封禁）
     */
    @Schema(description = "状态（0正常 1封禁）", example = "0", defaultValue = "0", allowableValues = {"0", "1"})
    @NotNull(message = "用户状态不能为空")
    @Min(value = 0, message = "用户状态只能为0或1")
    @Max(value = 1, message = "用户状态只能为0或1")
    private Integer userStatus;

}
