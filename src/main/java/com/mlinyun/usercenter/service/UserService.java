package com.mlinyun.usercenter.service;

import com.mlinyun.usercenter.model.domain.User;
import com.baomidou.mybatisplus.extension.service.IService;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

/**
 * 用户服务
 *
 * @author LinCanhui
 * @description 针对表【user(用户)】的数据库操作Service
 * @createDate 2024-01-29 22:18:17
 */
public interface UserService extends IService<User> {

    /**
     * 用户注册
     *
     * @param userAccount   用户账号
     * @param userPassword  用户密码
     * @param checkPassword 校验密码
     * @return 新用户id
     */
    long userRegister(String userAccount, String userPassword, String checkPassword);

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

    /**
     * 查询用户：根据用户名搜索用户
     *
     * @param username 用户名
     * @param request  请求
     * @return 查询到的用户
     */
    List<User> searchUsers(String username, HttpServletRequest request);

    /**
     * 删除用户：根据 id 删除用户
     *
     * @param id      要删除用户 id
     * @param request 请求
     * @return boolean 删除结果（true - 删除成功 false - 删除失败）
     */
    boolean deleteUser(long id, HttpServletRequest request);

    /**
     * 获取当前用户信息
     *
     * @param request 请求
     * @return 当前登录的用户信息
     */
    User getCurrentUser(HttpServletRequest request);

    /**
     * 用户注销功能
     *
     * @param request 请求
     * @return true - 注销成功 false - 注销失败
     */
    boolean userLogout(HttpServletRequest request);

}
