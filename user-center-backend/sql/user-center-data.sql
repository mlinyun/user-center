-- -- 使用 user_center 数据库
USE `user_center`;

-- 插入管理员账号（密码：Admin..1024）
INSERT INTO `user` (id, user_account, user_password, user_name, user_avatar, user_profile, user_role, user_gender,
                    user_phone, user_email, planet_code)
VALUES (1980484882008412161, 'Admin01', '$2a$10$8XpopHZYP3hHpa1dFHX6t.bbTWKD2kCU6qnAC.b397E/kUov3IOZm', '管理员',
        '/default_admin_avatar.png', '系统超级管理员，拥有所有权限', 'admin', 1, 15600000000,
        'admin15600@gmail.com', '00001');

-- 插入普通用户账号（密码：User..1024）
INSERT INTO `user` (id, user_account, user_password, user_name, user_avatar, user_profile, user_role, user_gender,
                    user_phone, user_email, planet_code)
VALUES (1980485882668683265, 'LingYun01', '$2a$10$up2CA1uezo7Wm6rUduRrhOYt46NcWY4zlk9s4GDFUF0oaVyl/4DpS', '凌云',
        '/default_user_avatar.png', '计算机科学与技术专业大三学生，热爱开发与设计', 'user', 1, 15600000001,
        'lingyun15611@gmail.com', '00002');
