package com.mlinyun.usercenterback.controller;

import com.mlinyun.usercenterback.common.BaseResponse;
import com.mlinyun.usercenterback.common.ErrorCode;
import com.mlinyun.usercenterback.common.ResultUtils;
import com.mlinyun.usercenterback.exception.BusinessException;
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
    public BaseResponse<Long> userRegister(@RequestBody UserRegisterRequest userRegisterRequest) {
        if (userRegisterRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        String userAccount = userRegisterRequest.getUserAccount();
        String userPassword = userRegisterRequest.getUserPassword();
        String checkPassword = userRegisterRequest.getCheckPassword();
        String planetCode = userRegisterRequest.getPlanetCode();
        if (StringUtils.isAnyBlank(userAccount, userPassword, checkPassword, planetCode)) {
            throw new BusinessException(ErrorCode.PARAMS_NULL);
        }
        long result = userService.userRegister(userAccount, userPassword, checkPassword, planetCode);
        return ResultUtils.success(result, "用户注册成功");
    }

    /**
     * 用户登录接口
     *
     * @param userLoginRequest 用户登录请求体
     * @param request          请求
     * @return 脱敏后的用户信息
     */
    @PostMapping("/login")
    public BaseResponse<User> userLogin(@RequestBody UserLoginRequest userLoginRequest, HttpServletRequest request) {
        if (userLoginRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_NULL);
        }
        String userAccount = userLoginRequest.getUserAccount();
        String userPassword = userLoginRequest.getUserPassword();
        if (StringUtils.isAnyBlank(userAccount, userPassword)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User user = userService.userLogin(userAccount, userPassword, request);
        return ResultUtils.success(user, "用户登录成功");
    }

    /**
     * 查询用户接口
     *
     * @param username 用户名
     * @param request  请求
     * @return 查询到的用户
     */
    @GetMapping("/search")
    public BaseResponse<List<User>> searchUsers(@RequestParam String username, HttpServletRequest request) {
        if (StringUtils.isAnyBlank(username)) {
            throw new BusinessException(ErrorCode.PARAMS_NULL);
        }
        List<User> userList = userService.searchUsers(username, request);
        return ResultUtils.success(userList, "用户查询成功");
    }

    /**
     * 删除用户接口
     *
     * @param id      要删除用户 id
     * @param request 请求
     * @return boolean 删除结果（true - 删除成功 false - 删除失败）
     */
    @PostMapping("/delete")
    public BaseResponse<Boolean> deleteUser(@RequestParam long id, HttpServletRequest request) {
        if (id < 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        boolean result = userService.deleteUser(id, request);
        return ResultUtils.success(result, "用户删除成功");
    }

    /**
     * 获取当前用户信息接口
     *
     * @param request 请求
     * @return 当前登录的用户信息
     */
    @GetMapping("/currentUser")
    public BaseResponse<User> getCurrentUser(HttpServletRequest request) {
        if (request == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User user = userService.getCurrentUser(request);
        return ResultUtils.success(user, "获取当前用户信息成功");
    }

    /**
     * 用户注销接口
     *
     * @param request 请求
     * @return true - 注销成功 false - 注销失败
     */
    @PostMapping("/outLogin")
    public BaseResponse<Boolean> userLogout(HttpServletRequest request) {
        if (request == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        boolean result = userService.userLogout(request);
        return ResultUtils.success(result, "用户注销成功");
    }

}
