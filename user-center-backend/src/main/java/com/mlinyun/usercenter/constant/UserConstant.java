package com.mlinyun.usercenter.constant;

/**
 * 用户常量类
 *
 * <p>
 * 用于存放用户相关的常量
 * </p>
 */
public final class UserConstant {

    /**
     * 私有构造函数，防止实例化
     */
    private UserConstant() {
        // 私有构造函数，防止实例化
        throw new IllegalStateException("Utility class");
    }

    // 用户角色相关常量
    /**
     * 管理员角色
     */
    public static final String ADMIN_USER_ROLE = "admin";

    // 用户登陆注册相关常量
    /**
     * 用户登录状态
     */
    public static final String USER_LOGIN_STATE = "userLoginState:";

    /**
     * 用户登录账号长度最小限制
     */
    public static final int USER_ACCOUNT_LENGTH_MIN_LIMIT = 4;

    /**
     * 用户登录账号长度最大限制
     */
    public static final int USER_ACCOUNT_LENGTH_MAX_LIMIT = 16;

    /**
     * 用户登录密码长度最小限制
     */
    public static final int USER_PASSWORD_LENGTH_MIN_LIMIT = 8;

    /**
     * 用户登录密码长度最大限制
     */
    public static final int USER_PASSWORD_LENGTH_MAX_LIMIT = 20;

    /**
     * 星球编号长度限制
     */
    public static final int USER_PLANET_CODE_LENGTH = 6;

    /**
     * 用户简介默认内容
     */
    public static final String USER_PROFILE_DEFAULT = "这个人很懒，什么都没有留下。";

    /**
     * 用户头像默认URL
     */
    public static final String USER_AVATAR_DEFAULT = "/default_user_avatar.png";

    // 数据库用户表（user）字段名常量
    /**
     * 用户表字段 - 主键ID
     */
    public static final String USER_TABLE_FIELD_ID = "id";

    /**
     * 用户表字段 - 用户账号
     */
    public static final String USER_TABLE_FIELD_USER_ACCOUNT = "user_account";

    /**
     * 用户表字段 - 用户昵称
     */
    public static final String USER_TABLE_FIELD_USER_NAME = "user_name";

    /**
     * 用户表字段 - 用户头像
     */
    public static final String USER_TABLE_FIELD_USER_AVATAR = "user_avatar";

    /**
     * 用户表字段 - 用户简介
     */
    public static final String USER_TABLE_FIELD_USER_PROFILE = "user_profile";

    /**
     * 用户表字段 - 用户角色
     */
    public static final String USER_TABLE_FIELD_USER_ROLE = "user_role";

    /**
     * 用户表字段 - 用户性别
     */
    public static final String USER_TABLE_FIELD_USER_GENDER = "user_gender";

    /**
     * 用户表字段 - 用户手机号
     */
    public static final String USER_TABLE_FIELD_USER_PHONE = "user_phone";

    /**
     * 用户表字段 - 用户邮箱
     */
    public static final String USER_TABLE_FIELD_USER_EMAIL = "user_email";

    /**
     * 用户表字段 - 用户状态
     */
    public static final String USER_TABLE_FIELD_USER_STATUS = "user_status";

    /**
     * 用户表字段 - 星球编号
     */
    public static final String USER_TABLE_FIELD_PLANET_CODE = "planet_code";

    /**
     * 用户表字段 - 创建时间
     */
    public static final String USER_TABLE_FIELD_CREATE_TIME = "create_time";

    /**
     * 用户表字段 - 更新时间
     */
    public static final String USER_TABLE_FIELD_UPDATE_TIME = "update_time";

}
