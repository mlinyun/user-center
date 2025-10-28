package com.mlinyun.usercenter.model.enums;

import cn.hutool.core.util.ObjectUtil;
import lombok.Getter;

/**
 * 用户角色枚举类
 *
 * <p>
 * 用于定义用户的角色类型，包括普通用户和管理员
 * </p>
 */
@Getter
public enum UserRoleEnum {

    USER("普通用户", "user"), ADMIN("管理员", "admin");

    /**
     * 角色名称
     */
    private final String role;

    /**
     * 角色值
     */
    private final String value;

    UserRoleEnum(String role, String value) {
        this.role = role;
        this.value = value;
    }

    /**
     * 根据角色值获取对应的枚举
     *
     * @param value 角色值
     * @return 对应的枚举，如果没有匹配的枚举则返回 null
     */
    public static UserRoleEnum getEnumByValue(String value) {
        if (ObjectUtil.isEmpty(value)) {
            return null;
        }
        for (UserRoleEnum userRoleEnum : UserRoleEnum.values()) {
            if (userRoleEnum.value.equals(value)) {
                return userRoleEnum;
            }
        }
        return null;
    }

}
