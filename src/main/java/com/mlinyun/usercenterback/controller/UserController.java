package com.mlinyun.usercenterback.controller;

import com.mlinyun.usercenterback.model.domain.User;
import com.mlinyun.usercenterback.model.domain.request.UserLoginRequest;
import com.mlinyun.usercenterback.model.domain.request.UserRegisterRequest;
import com.mlinyun.usercenterback.service.UserService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// 添加 @RestController 注解（适用于restful风格的API，返回值默认为json类型）
@RestController
//添加 @RequestMapping 注解（请求的路径）
@RequestMapping("user")
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
            // TODO 修改为自定义异常（请求参数为空）
            return null;
        }
        String userAccount = userRegisterRequest.getUserAccount();
        String userPassword = userRegisterRequest.getUserPassword();
        String checkPassword = userRegisterRequest.getCheckPassword();
        String planetCode = userRegisterRequest.getPlanetCode();
        if (StringUtils.isAnyBlank(userAccount, userPassword, checkPassword, planetCode)) {
            // TODO 修改为自定义异常（请求参数错误）
            return null;
        }
        return userService.userRegister(userAccount, userPassword, checkPassword, planetCode);
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
            // TODO 修改为自定义异常（请求参数为空）
            return null;
        }
        String userAccount = userLoginRequest.getUserAccount();
        String userPassword = userLoginRequest.getUserPassword();
        if (StringUtils.isAnyBlank(userAccount, userPassword)) {
            // TODO 修改为自定义异常（请求参数错误）
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
        if (StringUtils.isAnyBlank(username)) {
            // TODO 修改为自定义异常（请求参数为空）
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
            // TODO 修改为自定义异常（请求参数错误）
            return false;
        }
        return userService.deleteUser(id, request);
    }

    /**
     * 获取当前用户信息接口
     *
     * @param request 请求
     * @return 当前登录的用户信息
     */
    @GetMapping("/currentUser")
    public User getCurrentUser(HttpServletRequest request) {
        if (request == null) {
            // TODO 修改为自定义异常（请求参数错误）
            return null;
        }
        User user = userService.getCurrentUser(request);
        return user;
    }

    /**
     * 用户注销接口
     *
     * @param request 请求
     * @return true - 注销成功 false - 注销失败
     */
    @PostMapping("/outLogin")
    public boolean userLogout(HttpServletRequest request) {
        if (request == null) {
            // TODO 修改为自定义异常（请求参数错误）
            return false;
        }
        boolean result = userService.userLogout(request);
        return result;
    }

}
