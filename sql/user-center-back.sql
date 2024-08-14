-- 创建数据库
DROP DATABASE IF EXISTS `user_center`;
CREATE DATABASE IF NOT EXISTS `user_center` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT ENCRYPTION = 'N';
USE `user_center`;

-- MyBatis Plus 测试用到的表和数据（开始）
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`
(
    id    BIGINT      NOT NULL COMMENT '主键ID',
    name  VARCHAR(30) NULL DEFAULT NULL COMMENT '姓名',
    age   INT         NULL DEFAULT NULL COMMENT '年龄',
    email VARCHAR(50) NULL DEFAULT NULL COMMENT '邮箱',
    PRIMARY KEY (id)
);

DELETE
FROM `user`;

INSERT INTO `user` (id, name, age, email)
VALUES (1, 'Jon', 18, 'test1@baomidou.com'),
       (2, 'Jack', 20, 'test2@baomidou.com'),
       (3, 'Tom', 28, 'test3@baomidou.com'),
       (4, 'Sandy', 21, 'test4@baomidou.com'),
       (5, 'Billie', 24, 'test5@baomidou.com');
-- MyBatis Plus 测试用到的表和数据（结束）

-- 项目正式用到的用户表
DROP TABLE IF EXISTS `user`;
CREATE TABLE user_center.user
(
    id           bigint auto_increment comment 'id' primary key,
    username     varchar(256)                       null comment '用户昵称',
    userAccount  varchar(256)                       null comment '用户账号',
    avatarUrl    varchar(1024)                      null comment '用户头像',
    gender       tinyint                            null comment '性别',
    userPassword varchar(512)                       not null comment '用户密码',
    phone        varchar(128)                       null comment '电话',
    email        varchar(512)                       null comment '邮箱',
    userStatus   int      default 0                 not null comment '用户状态 0 - 正常',
    createTime   datetime default CURRENT_TIMESTAMP null comment '创建时间',
    updateTime   datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete     tinyint  default 0                 not null comment '是否删除',
    userRole     int      default 0                 not null comment '用户角色 0 - 普通用户 1 - 管理员',
    planetCode   varchar(512)                       not null comment '星球编号'
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT '用户';

DELETE
FROM user_center.user;
INSERT INTO user_center.user
VALUES (1, '凌云', 'LingYunAdmin', '/avatar.png', 1, '596b8d3f950830fda18e7ef035bd0918', '15600000000',
        '1234567890@qq.com', 0, '2024-01-30 01:01:10', '2024-02-05 01:57:05', 0, 1, '1'),
       (2, '凌云2', 'LingYunUser', '/avatar.png', 0, '596b8d3f950830fda18e7ef035bd0918', '15611111111',
        '1000000000@qq.com', 0, '2024-01-30 01:01:10', '2024-02-05 01:57:05', 0, 0, '2');