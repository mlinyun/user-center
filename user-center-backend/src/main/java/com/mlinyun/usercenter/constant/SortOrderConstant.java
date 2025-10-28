package com.mlinyun.usercenter.constant;

/**
 * 排序顺序常量类
 *
 * <p>
 * 用于定义排序顺序的常量值
 * </p>
 */
public final class SortOrderConstant {

    /**
     * 私有构造函数，防止实例化
     */
    private SortOrderConstant() {
        // 私有化构造函数，防止实例化
        throw new IllegalStateException("Utility class");
    }

    /**
     * 升序
     */
    public static final String ASC = "ascend";

    /**
     * 降序
     */
    public static final String DESC = "descend";

}
