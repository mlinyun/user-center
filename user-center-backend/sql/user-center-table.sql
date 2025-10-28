-- 使用 user_center 数据库
USE `user_center`;

-- 删除旧表（如果存在）
DROP TABLE IF EXISTS `user`;

-- 创建用户表
CREATE TABLE IF NOT EXISTS `user`
(
    id            BIGINT UNSIGNED PRIMARY KEY COMMENT '用户主键ID（雪花算法生成）',

    user_account  VARCHAR(128)                          NOT NULL COMMENT '登录账号（唯一）',
    user_password VARCHAR(60)                           NOT NULL COMMENT '登录密码（加密存储）',

    user_name     VARCHAR(64)            DEFAULT NULL COMMENT '用户昵称',
    user_avatar   VARCHAR(512)           DEFAULT NULL COMMENT '用户头像 URL',
    user_profile  VARCHAR(512)           DEFAULT NULL COMMENT '用户简介',

    user_role     ENUM ('user', 'admin') DEFAULT 'user' NOT NULL COMMENT '用户角色',
    user_gender   TINYINT UNSIGNED       DEFAULT 2 COMMENT '性别（0: 女 1: 男 2: 未知）',

    user_phone    VARCHAR(32)            DEFAULT NULL COMMENT '手机号',
    user_email    VARCHAR(128)           DEFAULT NULL COMMENT '邮箱地址',

    user_status   TINYINT UNSIGNED       DEFAULT 0      NOT NULL COMMENT '状态（0: 正常 1: 封禁）',
    planet_code   VARCHAR(64)            DEFAULT NULL COMMENT '星球编号',

    edit_time     DATETIME               DEFAULT CURRENT_TIMESTAMP COMMENT '编辑时间',
    create_time   DATETIME               DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time   DATETIME               DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    is_delete     BIGINT(20)             DEFAULT 0      NOT NULL COMMENT '逻辑删除（0: 未删 1: UNIX_TIMESTAMP()）',

    -- 唯一索引：确保账号在未删除状态下唯一
    UNIQUE KEY uk_user_account (user_account, is_delete) COMMENT '登录账号唯一索引（考虑逻辑删除）',

    -- 唯一索引：确保星球编号唯一（允许并发安全）
    UNIQUE KEY uk_planet_code (planet_code, is_delete) COMMENT '星球编号唯一索引（考虑逻辑删除）',

    -- 普通索引：优化查询性能
    INDEX idx_user_name (user_name) COMMENT '用户昵称索引',
    INDEX idx_user_phone (user_phone) COMMENT '手机号索引',
    INDEX idx_user_email (user_email) COMMENT '邮箱索引',
    INDEX idx_create_time (create_time) COMMENT '创建时间索引',
    INDEX idx_user_status (user_status, is_delete) COMMENT '用户状态复合索引'
)
    ENGINE = InnoDB
    DEFAULT CHARSET = utf8mb4
    COLLATE = utf8mb4_unicode_ci
    COMMENT = '用户信息表';
