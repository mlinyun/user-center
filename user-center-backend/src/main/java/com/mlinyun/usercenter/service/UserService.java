package com.mlinyun.usercenter.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
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
import jakarta.servlet.http.HttpServletRequest;

/**
 * 用户服务接口
 *
 * <p>
 * 定义了用户相关的业务操作方法，继承自 MyBatis-Plus 的 IService 接口
 * </p>
 */
public interface UserService extends IService<User> {

    /**
     * 用户注册
     *
     * @param userRegisterRequest 用户注册请求体
     * @return 注册成功的用户 ID
     */
    long userRegister(UserRegisterRequest userRegisterRequest);

    /**
     * 用户登录
     *
     * @param userLoginRequest 用户登录请求体
     * @param request HttpServletRequest 对象
     * @return 登录成功的用户信息
     */
    UserLoginVO userLogin(UserLoginRequest userLoginRequest, HttpServletRequest request);

    /**
     * 获取登录用户信息（后端使用）
     *
     * @param request HttpServletRequest 对象
     * @return 登录用户信息
     */
    User getLoginUser(HttpServletRequest request);

    /**
     * 获取登录用户信息
     *
     * @param request HttpServletRequest 对象
     * @return 脱敏后的用户信息
     */
    UserLoginVO getLoginUserInfo(HttpServletRequest request);

    /**
     * 用户注销
     *
     * @param request HttpServletRequest 对象
     * @return 是否注销成功
     */
    boolean userLogout(HttpServletRequest request);

    /**
     * 普通用户更新用户信息
     *
     * @param userUpdateInfoRequest 普通用户更新用户信息请求体
     * @param request HttpServletRequest 对象
     * @return 是否更新成功
     */
    boolean updateUserInfo(UserUpdateInfoRequest userUpdateInfoRequest, HttpServletRequest request);

    /**
     * 用户更新密码
     *
     * @param userUpdatePasswordRequest 用户更新密码请求体
     * @param request HttpServletRequest 对象
     * @return 是否更新成功
     */
    boolean updateUserPassword(UserUpdatePasswordRequest userUpdatePasswordRequest, HttpServletRequest request);

    /**
     * 管理员添加用户
     *
     * @param adminAddUserRequest 管理员添加用户请求体
     * @return 添加成功的用户 ID
     */
    long adminAddUser(AdminAddUserRequest adminAddUserRequest);

    /**
     * 管理员根据 id 获取用户信息
     *
     * @param adminGetUserRequest 管理员获取或删除用户请求体
     * @return 用户信息
     */
    User adminGetUserById(AdminGetOrDeleteUserRequest adminGetUserRequest);

    /**
     * 管理员根据 id 删除用户
     *
     * @param adminDeleteUserRequest 管理员获取或删除用户请求体
     * @return 是否删除成功
     */
    boolean adminDeleteUserById(AdminGetOrDeleteUserRequest adminDeleteUserRequest);

    /**
     * 管理员更新用户信息
     *
     * @param adminUpdateUserInfoRequest 管理员更新用户信息请求体
     * @return 是否更新成功
     */
    boolean adminUpdateUserInfo(AdminUpdateUserInfoRequest adminUpdateUserInfoRequest);

    /**
     * 管理员分页获取用户信息
     *
     * @param adminQueryUserRequest 管理员查询用户请求体
     * @return 分页的用户信息列表
     */
    Page<UserVO> adminGetUserInfoByPage(AdminQueryUserRequest adminQueryUserRequest);

    /**
     * 管理员重置用户密码
     *
     * @param adminResetUserPasswordRequest 管理员重置用户密码请求体
     * @return 是否重置成功
     */
    boolean adminResetUserPassword(AdminResetUserPasswordRequest adminResetUserPasswordRequest);

    /**
     * 管理员封禁或解封用户
     *
     * @param adminBanOrUnbanUserRequest 管理员获取或删除用户请求体
     * @return 是否操作成功
     */
    boolean adminBanOrUnbanUser(AdminBanOrUnbanUserRequest adminBanOrUnbanUserRequest);

}
