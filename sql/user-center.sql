DROP DATABASE IF EXISTS `user_center`;
CREATE DATABASE IF NOT EXISTS `user_center` DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_croatian_ci DEFAULT ENCRYPTION = 'N';
USE `user_center`;

DROP TABLE IF EXISTS `user`;

-- MyBatis Plus 测试用到的表和数据（开始）
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
VALUES (1, 'Jone', 18, 'test1@baomidou.com'),
       (2, 'Jack', 20, 'test2@baomidou.com'),
       (3, 'Tom', 28, 'test3@baomidou.com'),
       (4, 'Sandy', 21, 'test4@baomidou.com'),
       (5, 'Billie', 24, 'test5@baomidou.com');
-- MyBatis Plus 测试用到的表和数据（结束）

CREATE TABLE `user`
(
    `id`           bigint                                   NOT NULL AUTO_INCREMENT COMMENT 'id',
    `username`     varchar(256) COLLATE utf8mb3_croatian_ci          DEFAULT NULL COMMENT '用户昵称',
    `userAccount`  varchar(256) COLLATE utf8mb3_croatian_ci          DEFAULT NULL COMMENT '用户账号',
    `avatarUrl`    varchar(1024) COLLATE utf8mb3_croatian_ci         DEFAULT NULL COMMENT '用户头像',
    `gender`       tinyint                                           DEFAULT NULL COMMENT '性别',
    `userPassword` varchar(512) COLLATE utf8mb3_croatian_ci NOT NULL COMMENT '用户密码',
    `phone`        varchar(128) COLLATE utf8mb3_croatian_ci          DEFAULT NULL COMMENT '电话',
    `email`        varchar(512) COLLATE utf8mb3_croatian_ci          DEFAULT NULL COMMENT '邮箱',
    `userStatus`   int                                      NOT NULL DEFAULT '0' COMMENT '用户状态 0 - 正常',
    `createTime`   datetime                                          DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updateTime`   datetime                                          DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `isDelete`     tinyint                                  NOT NULL DEFAULT '0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb3
  COLLATE = utf8mb3_croatian_ci COMMENT ='用户';

