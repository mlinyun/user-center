package com.mlinyun.usercenter.controller;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.mlinyun.usercenter.annotation.AuthCheck;
import com.mlinyun.usercenter.common.BaseResponse;
import com.mlinyun.usercenter.common.ResultCodeEnum;
import com.mlinyun.usercenter.common.ResultUtils;
import com.mlinyun.usercenter.constant.UserConstant;
import com.mlinyun.usercenter.exception.ThrowUtils;
import com.mlinyun.usercenter.model.dto.AdminAddUserRequest;
import com.mlinyun.usercenter.model.dto.AdminBanOrUnbanUserRequest;
import com.mlinyun.usercenter.model.dto.AdminGetOrDeleteUserRequest;
import com.mlinyun.usercenter.model.dto.AdminQueryUserRequest;
import com.mlinyun.usercenter.model.dto.AdminResetUserPasswordRequest;
import com.mlinyun.usercenter.model.dto.AdminUpdateUserInfoRequest;
import com.mlinyun.usercenter.model.dto.UserLoginRequest;
import com.mlinyun.usercenter.model.dto.UserRegisterRequest;
import com.mlinyun.usercenter.model.dto.UserUpdateInfoRequest;
import com.mlinyun.usercenter.model.dto.UserUpdatePasswordRequest;
import com.mlinyun.usercenter.model.entity.User;
import com.mlinyun.usercenter.model.vo.UserLoginVO;
import com.mlinyun.usercenter.model.vo.UserVO;
import com.mlinyun.usercenter.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 用户控制器
 *
 * <p>
 * 该类用于处理与用户相关的请求，提供用户管理的接口
 * </p>
 */
@RestController
@RequestMapping("/user")
@Tag(name = "UserController", description = "用户相关接口")
public class UserController {

    /**
     * 用户服务
     */
    @Resource
    private UserService userService;

    /**
     * 用户注册接口
     *
     * @param userRegisterRequest 用户注册请求体
     * @return 注册成功的用户 ID
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/register")
    @Operation(summary = "用户注册", description = "用户注册接口")
    public BaseResponse<Long> userRegister(@RequestBody @Valid UserRegisterRequest userRegisterRequest) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(userRegisterRequest), ResultCodeEnum.PARAM_ERROR);
        long userId = userService.userRegister(userRegisterRequest);
        return ResultUtils.success(userId);
    }

    /**
     * 用户登录接口
     *
     * @param userLoginRequest 用户登录请求体
     * @param request HttpServletRequest 对象
     * @return 登录成功的用户信息
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/login")
    @Operation(summary = "用户登录", description = "用户登录接口")
    public BaseResponse<UserLoginVO> userLogin(@RequestBody @Valid UserLoginRequest userLoginRequest,
        HttpServletRequest request) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(userLoginRequest), ResultCodeEnum.PARAM_ERROR);
        UserLoginVO userLoginVO = userService.userLogin(userLoginRequest, request);
        return ResultUtils.success(userLoginVO);
    }

    /**
     * 获取登录用户信息接口
     *
     * @param request HttpServletRequest 对象
     * @return 登录用户信息
     */
    @ApiOperationSupport(author = "LingYun")
    @GetMapping("/loginUserInfo")
    @Operation(summary = "获取登录用户信息", description = "获取登录用户信息接口")
    public BaseResponse<UserLoginVO> getLoginUserInfo(HttpServletRequest request) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(request), ResultCodeEnum.PARAM_ERROR);
        UserLoginVO userLoginVO = userService.getLoginUserInfo(request);
        return ResultUtils.success(userLoginVO);
    }

    /**
     * 用户注销接口
     *
     * @param request HttpServletRequest 对象
     * @return 注销成功的消息
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/logout")
    @Operation(summary = "用户注销", description = "用户注销接口")
    public BaseResponse<Boolean> userLogout(HttpServletRequest request) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(request), ResultCodeEnum.PARAM_ERROR);
        boolean result = userService.userLogout(request);
        return ResultUtils.success(result);
    }

    /**
     * 普通用户更新用户信息
     *
     * @param userUpdateInfoRequest 普通用户更新用户信息请求体
     * @param request HttpServletRequest 对象
     * @return 是否更新成功
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/updateUserInfo")
    @Operation(summary = "更新用户信息", description = "更新用户信息接口")
    public BaseResponse<Boolean> updateUserInfo(@RequestBody @Valid UserUpdateInfoRequest userUpdateInfoRequest,
        HttpServletRequest request) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(userUpdateInfoRequest), ResultCodeEnum.PARAM_ERROR);
        boolean result = userService.updateUserInfo(userUpdateInfoRequest, request);
        return ResultUtils.success(result);
    }

    /**
     * 用户更新密码接口
     *
     * @param userUpdatePasswordRequest 用户更新密码请求体
     * @param request HttpServletRequest 对象
     * @return 是否更新成功
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/updatePassword")
    @Operation(summary = "用户重置密码", description = "用户重置密码接口")
    public BaseResponse<Boolean> updateUserPassword(
        @RequestBody @Valid UserUpdatePasswordRequest userUpdatePasswordRequest, HttpServletRequest request) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(userUpdatePasswordRequest), ResultCodeEnum.PARAM_ERROR);
        boolean result = userService.updateUserPassword(userUpdatePasswordRequest, request);
        return ResultUtils.success(result);
    }

    /**
     * 管理员添加用户接口
     *
     * @param adminAddUserRequest 管理员添加用户请求体
     * @return 添加成功的用户 ID
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/addUser")
    @AuthCheck(mustRole = UserConstant.ADMIN_USER_ROLE)
    @Operation(summary = "管理员添加用户", description = "管理员添加用户接口")
    public BaseResponse<Long> adminAddUser(@RequestBody @Valid AdminAddUserRequest adminAddUserRequest) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(adminAddUserRequest), ResultCodeEnum.PARAM_ERROR);
        long userId = userService.adminAddUser(adminAddUserRequest);
        return ResultUtils.success(userId);
    }

    /**
     * 管理员根据 id 获取用户信息接口
     *
     * @param adminGetUserRequest 管理员获取或删除用户请求体
     * @return 用户信息
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/getUserById")
    @AuthCheck(mustRole = UserConstant.ADMIN_USER_ROLE)
    @Operation(summary = "管理员根据 id 获取用户信息", description = "管理员根据 id 获取用户信息接口")
    public BaseResponse<User> adminGetUserById(@RequestBody @Valid AdminGetOrDeleteUserRequest adminGetUserRequest) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(adminGetUserRequest), ResultCodeEnum.PARAM_ERROR);
        User user = userService.adminGetUserById(adminGetUserRequest);
        return ResultUtils.success(user);
    }

    /**
     * 管理员根据 id 删除用户接口
     *
     * @param adminDeleteUserRequest 管理员获取或删除用户请求体
     * @return 是否删除成功
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/deleteUserById")
    @AuthCheck(mustRole = UserConstant.ADMIN_USER_ROLE)
    @Operation(summary = "管理员根据 id 删除用户", description = "管理员根据 id 删除用户接口")
    public BaseResponse<Boolean>
        adminDeleteUserById(@RequestBody @Valid AdminGetOrDeleteUserRequest adminDeleteUserRequest) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(adminDeleteUserRequest), ResultCodeEnum.PARAM_ERROR);
        boolean result = userService.adminDeleteUserById(adminDeleteUserRequest);
        return ResultUtils.success(result);
    }

    /**
     * 管理员更新用户信息接口
     *
     * @param adminUpdateUserInfoRequest 管理员更新用户信息请求体
     * @return 是否更新成功
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/adminUpdateUserInfo")
    @AuthCheck(mustRole = UserConstant.ADMIN_USER_ROLE)
    @Operation(summary = "管理员更新用户信息", description = "管理员更新用户信息接口")
    public BaseResponse<Boolean>
        adminUpdateUserInfo(@RequestBody @Valid AdminUpdateUserInfoRequest adminUpdateUserInfoRequest) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(adminUpdateUserInfoRequest), ResultCodeEnum.PARAM_ERROR);
        boolean result = userService.adminUpdateUserInfo(adminUpdateUserInfoRequest);
        return ResultUtils.success(result);
    }

    /**
     * 管理员分页获取用户列表接口
     *
     * @param adminQueryUserRequest 管理员查询用户请求体
     * @return 用户列表分页结果
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/adminGetUserInfoByPage")
    @AuthCheck(mustRole = UserConstant.ADMIN_USER_ROLE)
    @Operation(summary = "管理员分页获取用户列表", description = "管理员分页获取用户列表接口")
    public BaseResponse<Page<UserVO>>
        adminGetUserInfoByPage(@RequestBody @Valid AdminQueryUserRequest adminQueryUserRequest) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(adminQueryUserRequest), ResultCodeEnum.PARAM_ERROR);
        Page<UserVO> userVOPage = userService.adminGetUserInfoByPage(adminQueryUserRequest);
        return ResultUtils.success(userVOPage);
    }

    /**
     * 管理员重置用户密码接口
     *
     * @param adminResetUserPasswordRequest 管理员重置用户密码请求体
     * @return 是否重置成功
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/adminResetUserPassword")
    @AuthCheck(mustRole = UserConstant.ADMIN_USER_ROLE)
    @Operation(summary = "管理员重置用户密码", description = "管理员重置用户密码接口")
    public BaseResponse<Boolean>
        adminResetUserPassword(@RequestBody @Valid AdminResetUserPasswordRequest adminResetUserPasswordRequest) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(adminResetUserPasswordRequest), ResultCodeEnum.PARAM_ERROR);
        boolean result = userService.adminResetUserPassword(adminResetUserPasswordRequest);
        return ResultUtils.success(result);
    }

    /**
     * 管理员封禁或解封用户接口
     *
     * @param adminBanOrUnbanUserRequest 管理员封禁或解封用户请求体
     * @return 是否操作成功
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/adminBanOrUnbanUser")
    @AuthCheck(mustRole = UserConstant.ADMIN_USER_ROLE)
    @Operation(summary = "管理员封禁或解封用户", description = "管理员封禁或解封用户接口")
    public BaseResponse<Boolean>
        adminBanOrUnbanUser(@RequestBody @Valid AdminBanOrUnbanUserRequest adminBanOrUnbanUserRequest) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(adminBanOrUnbanUserRequest), ResultCodeEnum.PARAM_ERROR);
        boolean result = userService.adminBanOrUnbanUser(adminBanOrUnbanUserRequest);
        return ResultUtils.success(result);
    }

}
