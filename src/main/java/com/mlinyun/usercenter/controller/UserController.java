package com.mlinyun.usercenter.controller;

import com.mlinyun.usercenter.model.domain.User;
import com.mlinyun.usercenter.model.domain.request.UserLoginRequest;
import com.mlinyun.usercenter.model.domain.request.UserRegisterRequest;
import com.mlinyun.usercenter.service.UserService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    @Resource
    private UserService userService;

    /**
     * 用户注册接口
     *
     * @param userRegisterRequest 用户注册请求体
     * @return 新用户 id
     */
    @PostMapping("/register")
    public Long userRegister(@RequestBody UserRegisterRequest userRegisterRequest) {
        if (userRegisterRequest == null) {
            return null;
        }
        String userAccount = userRegisterRequest.getUserAccount();
        String userPassword = userRegisterRequest.getUserPassword();
        String checkPassword = userRegisterRequest.getCheckPassword();
        if (StringUtils.isAnyBlank(userAccount, userPassword, checkPassword)) {
            return null;
        }
        return userService.userRegister(userAccount, userPassword, checkPassword);
    }

    /**
     * 用户登录接口
     *
     * @param userLoginRequest 用户登录请求体
     * @param request          请求
     * @return 脱敏后的用户信息
     */
    @PostMapping("/login")
    public User userLogin(@RequestBody UserLoginRequest userLoginRequest, HttpServletRequest request) {
        if (userLoginRequest == null) {
            return null;
        }
        String userAccount = userLoginRequest.getUserAccount();
        String userPassword = userLoginRequest.getUserPassword();
        if (StringUtils.isAnyBlank(userAccount, userPassword)) {
            return null;
        }
        return userService.userLogin(userAccount, userPassword, request);
    }

    /**
     * 查询用户接口
     *
     * @param username 用户名
     * @param request  请求
     * @return 查询到的用户
     */
    @GetMapping("/search")
    public List<User> searchUsers(@RequestParam String username, HttpServletRequest request) {
        System.out.println(username);
        if (StringUtils.isAnyBlank(username)) {
            return null;
        }
        return userService.searchUsers(username, request);
    }

    /**
     * 删除用户接口
     *
     * @param id      要删除用户 id
     * @param request 请求
     * @return boolean 删除结果（true - 删除成功 false - 删除失败）
     */
    @PostMapping("/delete")
    public boolean deleteUser(@RequestParam long id, HttpServletRequest request) {
        if (id < 0) {
            return false;
        }
        return userService.deleteUser(id, request);
    }

}
