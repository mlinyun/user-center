package com.mlinyun.usercenterback.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.mlinyun.usercenterback.model.domain.User;
import jakarta.servlet.http.HttpServletRequest;

/**
* @author LinCanhui
* @description 针对表【user(用户)】的数据库操作Service
* @createDate 2024-08-14 17:32:13
*/
public interface UserService extends IService<User> {

    /**
     * 用户注册
     *
     * @param userAccount   用户账号
     * @param userPassword  用户密码
     * @param checkPassword 校验密码
     * @param planetCode    星球编号
     * @return 新注册的用户 id
     */
    long userRegister(String userAccount, String userPassword, String checkPassword, String planetCode);

    /**
     * 用户登录
     *
     * @param userAccount  用户账号
     * @param userPassword 用户密码
     * @param request      请求
     * @return 脱敏后的用户信息
     */
    User userLogin(String userAccount, String userPassword, HttpServletRequest request);

    /**
     * 用户信息脱敏方法
     *
     * @param originUser 要脱敏的 user 对象
     * @return 脱敏后的用户信息
     */
    User getSafetyUser(User originUser);

}
