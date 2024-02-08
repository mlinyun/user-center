package com.mlinyun.usercenter.controller;

import com.mlinyun.usercenter.common.BaseResponse;
import com.mlinyun.usercenter.common.ErrorCode;
import com.mlinyun.usercenter.common.ResultUtils;
import com.mlinyun.usercenter.exception.BusinessException;
import com.mlinyun.usercenter.model.domain.User;
import com.mlinyun.usercenter.model.domain.request.UserLoginRequest;
import com.mlinyun.usercenter.model.domain.request.UserRegisterRequest;
import com.mlinyun.usercenter.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "用户中心接口", description = "该接口为用户接口，主要有用户注册，登录，注销，搜索，删除，获取用户信息的接口")
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
    @Operation(summary = "用户注册", description = "使用账号密码星球编号注册账号", tags = {"用户中心接口"})
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
    @Operation(summary = "用户登录", description = "账号密码登录", tags = {"用户中心接口"})
    @PostMapping("/login")
    public BaseResponse<User> userLogin(@RequestBody UserLoginRequest userLoginRequest, HttpServletRequest request) {
        if (userLoginRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        String userAccount = userLoginRequest.getUserAccount();
        String userPassword = userLoginRequest.getUserPassword();
        if (StringUtils.isAnyBlank(userAccount, userPassword)) {
            throw new BusinessException(ErrorCode.PARAMS_NULL);
        }
        User user = userService.userLogin(userAccount, userPassword, request);
        return ResultUtils.success(user, "用户登录成功");
    }

    /**
     * 用户注销接口
     *
     * @param request 请求
     * @return true - 注销成功 false - 注销失败
     */
    @Operation(summary = "用户注销", description = "用户退出登录", tags = {"用户中心接口"})
    @PostMapping("/outLogin")
    public BaseResponse<Boolean> userLogout(HttpServletRequest request) {
        if (request == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        boolean result = userService.userLogout(request);
        return ResultUtils.success(result, "用户注销成功");
    }

    /**
     * 查询用户接口
     *
     * @param username 用户名
     * @param request  请求
     * @return 查询到的用户
     */
    @Operation(summary = "搜索用户", description = "搜索全部用或根据用户名进行模糊搜索", tags = {"用户中心接口"})
    @GetMapping("/search")
    public BaseResponse<List<User>> searchUsers(String username, HttpServletRequest request) {
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
    @Operation(summary = "删除用户", description = "通过 id 删除用户", tags = {"用户中心接口"})
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
    @Operation(summary = "获取用户信息", description = "获取当前登录用户脱敏之后的信息", tags = {"用户中心接口"})
    @GetMapping("/currentUser")
    public BaseResponse<User> getCurrentUser(HttpServletRequest request) {
        if (request == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User user = userService.getCurrentUser(request);
        return ResultUtils.success(user, "获取当前用户信息成功");
    }

}
