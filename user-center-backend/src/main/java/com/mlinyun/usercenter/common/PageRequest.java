package com.mlinyun.usercenter.common;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import java.io.Serial;
import java.io.Serializable;
import lombok.Data;

/**
 * 分页请求参数
 *
 * <p>
 * 用于分页查询的请求参数，包含当前页码、每页记录数、排序字段和排序方式
 * </p>
 */
@Data
@Schema(description = "分页请求参数")
public class PageRequest implements Serializable {

    /**
     * 序列化版本号
     */
    @Serial
    private static final long serialVersionUID = 8887748428137551185L;

    /**
     * 默认页码每页记录数
     */
    private static final int DEFAULT_PAGE_SIZE = 10;

    /**
     * 当前页码
     */
    @Schema(description = "当前页码", example = "1", defaultValue = "1")
    @Min(value = 1, message = "当前页码必须大于或等于 1")
    private int current = 1;

    /**
     * 每页记录数
     */
    @Schema(description = "每页记录数", example = "10", defaultValue = "10")
    @Min(value = 1, message = "每页记录数必须大于或等于 1")
    @Max(value = 200, message = "每页记录数不能超过 200")
    private int pageSize = DEFAULT_PAGE_SIZE;

    /**
     * 排序字段
     */
    @Schema(description = "排序字段", example = "createTime")
    @Pattern(regexp = "^[A-Za-z0-9_\\.]+$", message = "排序字段只能包含字母、数字、下划线和点")
    private String sortField;

    /**
     * 排序方式（默认升序）
     */
    @Schema(description = "排序方式", example = "descend", defaultValue = "descend",
        allowableValues = {"ascend", "descend"})
    @Pattern(regexp = "^(?:ascend|descend)$", message = "排序方式必须是 'ascend' 或 'descend'")
    private String sortOrder = "descend";

}
