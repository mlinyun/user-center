package com.mlinyun.usercenter.service.impl;

import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.mlinyun.usercenter.common.ResultCodeEnum;
import com.mlinyun.usercenter.constant.SortOrderConstant;
import com.mlinyun.usercenter.constant.UserConstant;
import com.mlinyun.usercenter.exception.BusinessException;
import com.mlinyun.usercenter.exception.ThrowUtils;
import com.mlinyun.usercenter.mapper.UserMapper;
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
import com.mlinyun.usercenter.model.enums.UserRoleEnum;
import com.mlinyun.usercenter.model.vo.UserLoginVO;
import com.mlinyun.usercenter.model.vo.UserVO;
import com.mlinyun.usercenter.service.UserService;
import com.mlinyun.usercenter.utils.PasswordUtil;
import jakarta.servlet.http.HttpServletRequest;
import java.beans.PropertyDescriptor;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 用户服务实现类
 *
 * <p>
 * 该类继承自 MyBatis-Plus 的 ServiceImpl，提供了对 User 实体的基本 CRUD 操作
 * </p>
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    /**
     * 用户注册服务
     *
     * @param userRegisterRequest 用户注册请求体
     * @return 注册成功的用户 ID
     */
    @Override
    @Transactional(rollbackFor = BusinessException.class)
    public long userRegister(UserRegisterRequest userRegisterRequest) {
        // 1. 基本参数校验（通过 @Valid 注解在 Controller 层已完成大部分校验）
        this.validateRegisterRequest(userRegisterRequest);

        String userAccount = userRegisterRequest.getUserAccount(); // 登陆账号
        String userPassword = userRegisterRequest.getUserPassword(); // 登陆密码
        String checkPassword = userRegisterRequest.getCheckPassword(); // 校验密码
        String planetCode = userRegisterRequest.getPlanetCode(); // 星球编号

        // 2. 校验用户注册参数
        this.validateRegisterParams(userAccount, userPassword, checkPassword, planetCode);

        // 3. 校验登陆账号与星球编号唯一性
        this.validateUniqueFields(userAccount, planetCode);

        // 4. 加密密码（使用 BCrypt，自动生成盐值）
        String encryptedPassword = PasswordUtil.encrypt(checkPassword);

        // 5. 插入用户数据到数据库
        User user = buildNewUser(userAccount, encryptedPassword, planetCode);
        boolean saveResult = this.save(user);
        ThrowUtils.throwIf(!saveResult, ResultCodeEnum.SERVER_ERROR, "用户注册失败，数据库插入异常");

        // 6. 返回新注册用户的 ID
        return user.getId();
    }

    /**
     * 验证注册请求基本参数
     *
     * @param request 用户注册请求体
     */
    private void validateRegisterRequest(UserRegisterRequest request) {
        if (ObjectUtil.isEmpty(request)) {
            throw new BusinessException(ResultCodeEnum.PARAM_ERROR, "用户注册请求体不能为空");
        }

        // 注：这些校验应该在 DTO 中使用 @NotBlank 等注解完成（这里保留是为了双重保险）
        if (ObjectUtil.hasEmpty(request.getUserAccount(), request.getUserPassword(), request.getCheckPassword(),
            request.getPlanetCode())) {
            throw new BusinessException(ResultCodeEnum.PARAM_ERROR, "必填参数不能为空");
        }
    }

    /**
     * 验证用户注册参数
     *
     * @param userAccount 登陆账号
     * @param userPassword 登陆密码
     * @param checkPassword 校验密码
     * @param planetCode 星球编号
     */
    private void validateRegisterParams(String userAccount, String userPassword, String checkPassword,
        String planetCode) {
        if (ObjectUtil.hasEmpty(userAccount, userPassword, checkPassword, planetCode)) {
            throw new BusinessException(ResultCodeEnum.PARAM_ERROR, "必填参数不能为空");
        }

        // 1. 校验账号长度
        if (userAccount.length() < UserConstant.USER_ACCOUNT_LENGTH_MIN_LIMIT
            || userAccount.length() > UserConstant.USER_ACCOUNT_LENGTH_MAX_LIMIT) {
            throw new BusinessException(ResultCodeEnum.PARAM_ERROR,
                "登录账号长度不合法（范围 " + UserConstant.USER_ACCOUNT_LENGTH_MIN_LIMIT + "-"
                    + UserConstant.USER_ACCOUNT_LENGTH_MAX_LIMIT + " 位）");
        }

        // 2. 校验账号格式（只允许字母、数字和下划线）
        String validPattern = "^\\w+$"; // 只允许字母、数字和下划线 \w 等同于 [a-zA-Z0-9_]
        if (!userAccount.matches(validPattern)) {
            throw new BusinessException(ResultCodeEnum.PARAM_ERROR, "登录账号只能包含字母、数字和下划线");
        }

        // 3. 校验登录密码和校验密码长度（范围 8-20 位）
        ThrowUtils.throwIf(!(PasswordUtil.isValidBasic(userPassword) && PasswordUtil.isValidBasic(checkPassword)),
            ResultCodeEnum.PARAM_ERROR, "登录密码长度不合法（范围 " + UserConstant.USER_PASSWORD_LENGTH_MIN_LIMIT + "-"
                + UserConstant.USER_PASSWORD_LENGTH_MAX_LIMIT + " 位）");

        // 4. 校验密码强度（必须包含字母和数字）
        ThrowUtils.throwIf(!PasswordUtil.isValidStrong(userPassword), ResultCodeEnum.PARAM_ERROR,
            "登录密码强度不够，必须包含大写字母、小写字母、数字和特殊字符");

        // 5. 校验登录密码和校验密码是否一致
        ThrowUtils.throwIf(!userPassword.equals(checkPassword), ResultCodeEnum.PARAM_ERROR, "登录密码和校验密码不一致");

        // 6 校验星球编号长度不超过 6 位
        if (planetCode.length() > UserConstant.USER_PLANET_CODE_LENGTH) {
            throw new BusinessException(ResultCodeEnum.PARAM_ERROR,
                "星球编号长度不能超过 " + UserConstant.USER_PLANET_CODE_LENGTH + " 位");
        }
    }

    /**
     * 校验登陆账号与星球编号唯一性
     *
     * @param userAccount 登陆账号
     * @param planetCode 星球编号
     */
    private void validateUniqueFields(String userAccount, String planetCode) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq(UserConstant.USER_TABLE_FIELD_USER_ACCOUNT, userAccount).or()
            .eq(UserConstant.USER_TABLE_FIELD_PLANET_CODE, planetCode);
        long count = this.baseMapper.selectCount(queryWrapper);
        if (count > 0) {
            throw new BusinessException(ResultCodeEnum.PARAM_ERROR, "登录账号或星球编号已存在");
        }
    }

    /**
     * 构建新用户实体
     *
     * @param userAccount 登陆账号
     * @param encryptedPassword 加密后的密码
     * @param planetCode 星球编号
     * @return 新用户实体
     */
    private User buildNewUser(String userAccount, String encryptedPassword, String planetCode) {
        User user = new User();
        user.setUserAccount(userAccount);
        user.setUserPassword(encryptedPassword);
        user.setUserName(userAccount); // 默认昵称与登录账号相同
        user.setPlanetCode(planetCode);
        user.setUserRole(UserRoleEnum.USER.getValue()); // 默认用户角色为普通用户
        // 设置默认的用户头像和简介
        user.setUserAvatar(UserConstant.USER_AVATAR_DEFAULT);
        user.setUserProfile(UserConstant.USER_PROFILE_DEFAULT);
        return user;
    }

    /**
     * 用户登录
     *
     * @param userLoginRequest 用户登录请求体
     * @param request HttpServletRequest 对象
     * @return 登录成功的用户信息
     */
    @Override
    public UserLoginVO userLogin(UserLoginRequest userLoginRequest, HttpServletRequest request) {
        // 1. 基本参数校验（通过 @Valid 注解在 Controller 层已完成大部分校验）
        this.validateLoginRequest(userLoginRequest);

        String userAccount = userLoginRequest.getUserAccount(); // 登陆账号
        String userPassword = userLoginRequest.getUserPassword(); // 登陆密码

        // 2. 校验用户登录参数
        this.validateLoginParams(userAccount, userPassword);

        // 3. 查询用户信息
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq(UserConstant.USER_TABLE_FIELD_USER_ACCOUNT, userAccount);
        User loginUser = this.baseMapper.selectOne(queryWrapper);
        ThrowUtils.throwIf(ObjectUtil.isEmpty(loginUser), ResultCodeEnum.PARAM_ERROR, "用户不存在或密码错误");

        // 4. 校验密码
        boolean isPasswordMatch = PasswordUtil.verify(userPassword, loginUser.getUserPassword());
        ThrowUtils.throwIf(!isPasswordMatch, ResultCodeEnum.PARAM_ERROR, "用户不存在或密码错误");

        // 5. 查看用户是否被禁用
        // 获取用户状态
        Integer userStatus = loginUser.getUserStatus();
        // 非零则为禁用状态
        ThrowUtils.throwIf(userStatus != null && userStatus != 0, ResultCodeEnum.FORBIDDEN_ERROR, "用户已被禁用");
        // 6. 记录用户登录状态
        request.getSession().setAttribute(UserConstant.USER_LOGIN_STATE, loginUser);

        // 7. 返回用户信息（脱敏）
        return this.getUserLoginVO(loginUser);
    }

    /**
     * 验证登录请求基本参数
     *
     * @param request 用户登录请求体
     */
    private void validateLoginRequest(UserLoginRequest request) {
        if (ObjectUtil.isEmpty(request)) {
            throw new BusinessException(ResultCodeEnum.PARAM_ERROR, "用户登录请求体不能为空");
        }

        if (ObjectUtil.hasEmpty(request.getUserAccount(), request.getUserPassword())) {
            throw new BusinessException(ResultCodeEnum.PARAM_ERROR, "必填参数不能为空");
        }
    }

    /**
     * 验证用户登录参数
     *
     * @param userAccount 登陆账号
     * @param userPassword 登陆密码
     */
    private void validateLoginParams(String userAccount, String userPassword) {
        if (ObjectUtil.hasEmpty(userAccount, userPassword)) {
            throw new BusinessException(ResultCodeEnum.PARAM_ERROR, "必填参数不能为空");
        }

        // 1. 校验账号长度
        if (userAccount.length() < UserConstant.USER_ACCOUNT_LENGTH_MIN_LIMIT
            || userAccount.length() > UserConstant.USER_ACCOUNT_LENGTH_MAX_LIMIT) {
            throw new BusinessException(ResultCodeEnum.PARAM_ERROR,
                "登录账号长度不合法（范围 " + UserConstant.USER_ACCOUNT_LENGTH_MIN_LIMIT + "-"
                    + UserConstant.USER_ACCOUNT_LENGTH_MAX_LIMIT + " 位）");
        }

        // 2. 校验账号格式（只允许字母、数字和下划线）
        String validPattern = "^\\w+$"; // 只允许字母、数字和下划线 \w 等同于 [a-zA-Z0-9_]
        if (!userAccount.matches(validPattern)) {
            throw new BusinessException(ResultCodeEnum.PARAM_ERROR, "登录账号只能包含字母、数字和下划线");
        }

        // 3. 校验登录密码和校验密码长度（范围 8-20 位）
        ThrowUtils.throwIf(!PasswordUtil.isValidBasic(userPassword), ResultCodeEnum.PARAM_ERROR, "登录密码长度不合法（范围 "
            + UserConstant.USER_PASSWORD_LENGTH_MIN_LIMIT + "-" + UserConstant.USER_PASSWORD_LENGTH_MAX_LIMIT + " 位）");

    }

    /**
     * 获得登录后的用户信息
     *
     * @param user 登录后的用户信息
     * @return 脱敏后的用户信息
     */
    private UserLoginVO getUserLoginVO(User user) {
        if (user == null) {
            return null;
        }
        UserLoginVO userLoginVO = new UserLoginVO();
        BeanUtils.copyProperties(user, userLoginVO);
        return userLoginVO;
    }

    /**
     * 获取登录用户信息（后端使用）
     *
     * @param request HttpServletRequest 对象
     * @return 登录用户信息
     */
    @Override
    public User getLoginUser(HttpServletRequest request) {
        // 判断登录状态
        Object userObj = request.getSession().getAttribute(UserConstant.USER_LOGIN_STATE);
        User currentUser = (User) userObj;
        if (ObjectUtil.isEmpty(currentUser) || ObjectUtil.isEmpty(currentUser.getId())) {
            throw new BusinessException(ResultCodeEnum.NOT_LOGIN_ERROR);
        }
        // 从数据库中查询用户信息（追求性能的话可以注释，直接返回上述结果）
        Long userId = currentUser.getId();
        currentUser = this.getById(userId);
        ThrowUtils.throwIf(currentUser == null, ResultCodeEnum.NOT_LOGIN_ERROR);
        return currentUser;
    }

    /**
     * 获取登录用户信息（前端调用）
     *
     * @param request HttpServletRequest 对象
     * @return 脱敏后的用户信息
     */
    @Override
    public UserLoginVO getLoginUserInfo(HttpServletRequest request) {
        // 获取登录用户信息
        User loginUser = this.getLoginUser(request);
        // 返回脱敏后的用户信息
        return this.getUserLoginVO(loginUser);
    }

    /**
     * 用户注销
     *
     * @param request HttpServletRequest 对象
     * @return 是否注销成功
     */
    @Override
    public boolean userLogout(HttpServletRequest request) {
        // 判断登录状态
        Object userObj = request.getSession().getAttribute(UserConstant.USER_LOGIN_STATE);
        if (ObjectUtil.isEmpty(userObj)) {
            throw new BusinessException(ResultCodeEnum.OPERATION_ERROR, "操作失败，用户未登录");
        }
        try {
            // 清除登录状态
            request.getSession().removeAttribute(UserConstant.USER_LOGIN_STATE);
            return true;
        } catch (Exception e) {
            // 处理异常
            log.error("用户注销失败", e);
            return false;
        }
    }

    /**
     * 普通用户更新用户信息
     *
     * @param userUpdateInfoRequest 普通用户更新用户信息请求体
     * @param request HttpServletRequest 对象
     * @return 是否更新成功
     */
    @Override
    public boolean updateUserInfo(UserUpdateInfoRequest userUpdateInfoRequest, HttpServletRequest request) {
        // 1. 参数校验
        ThrowUtils.throwIf(ObjectUtil.isEmpty(userUpdateInfoRequest), ResultCodeEnum.PARAM_ERROR, "普通用户信息更新请求不能为空");

        // 2. 获取当前登录用户（会抛出未登录异常）
        User loginUser = this.getLoginUser(request);

        // 3. 仅允许更新自己的信息
        Long userId = loginUser.getId();
        ThrowUtils.throwIf(!userId.equals(userUpdateInfoRequest.getId()), ResultCodeEnum.NO_AUTH_ERROR, "无权限更新他人信息");

        // 4. 构建更新实体
        User updateUser = new User();
        // DTO 中某些可选字段为 null，直接拷贝会把数据库实体中的原值覆盖为 null
        // 可先收集 source 中为 null 的属性名，然后传给 copyProperties 的忽略参数
        String[] ignore = getNullPropertyNames(userUpdateInfoRequest);
        BeanUtils.copyProperties(userUpdateInfoRequest, updateUser, ignore);

        // 5. 执行更新
        boolean updateResult = this.updateById(updateUser);
        ThrowUtils.throwIf(!updateResult, ResultCodeEnum.SERVER_ERROR, "用户信息更新失败，数据库更新异常");

        // 6. 返回更新结果
        return true;
    }

    /**
     * 用户更新密码
     *
     * @param userUpdatePasswordRequest 用户更新密码请求体
     * @param request HttpServletRequest 对象
     * @return 是否更新成功
     */
    @Override
    public boolean updateUserPassword(UserUpdatePasswordRequest userUpdatePasswordRequest, HttpServletRequest request) {
        // 1. 参数校验
        ThrowUtils.throwIf(ObjectUtil.isEmpty(userUpdatePasswordRequest), ResultCodeEnum.PARAM_ERROR, "用户密码更新请求不能为空");

        // 2. 获取当前登录用户（会抛出未登录异常）
        User loginUser = this.getLoginUser(request);
        Long userId = loginUser.getId();
        ThrowUtils.throwIf(!userId.equals(userUpdatePasswordRequest.getId()), ResultCodeEnum.NO_AUTH_ERROR,
            "无权限更新他人密码");

        // 3. 获取传递的参数
        String rawPassword = userUpdatePasswordRequest.getRawPassword(); // 原始密码
        String newPassword = userUpdatePasswordRequest.getNewPassword(); // 新的密码
        String checkPassword = userUpdatePasswordRequest.getCheckPassword(); // 校验密码
        ThrowUtils.throwIf(ObjectUtil.hasEmpty(rawPassword, newPassword, checkPassword), ResultCodeEnum.PARAM_ERROR,
            "必填参数不能为空");

        // 4. 校验旧密码
        boolean isPasswordMatch = PasswordUtil.verify(rawPassword, loginUser.getUserPassword());
        ThrowUtils.throwIf(!isPasswordMatch, ResultCodeEnum.PARAM_ERROR, "原始密码错误");

        // 5. 校验新密码长度与强度
        ThrowUtils.throwIf(!PasswordUtil.isValidBasic(newPassword), ResultCodeEnum.PARAM_ERROR, "登录密码长度不合法（范围 "
            + UserConstant.USER_PASSWORD_LENGTH_MIN_LIMIT + "-" + UserConstant.USER_PASSWORD_LENGTH_MAX_LIMIT + " 位）");
        ThrowUtils.throwIf(!PasswordUtil.isValidStrong(newPassword), ResultCodeEnum.PARAM_ERROR,
            "登录密码强度不够，必须包含大写字母、小写字母、数字和特殊字符");

        // 6. 校验新密码和校验密码是否一致，且不能与原始密码相同
        ThrowUtils.throwIf(!newPassword.equals(checkPassword), ResultCodeEnum.PARAM_ERROR, "新密码和校验密码不一致");
        ThrowUtils.throwIf(rawPassword.equals(newPassword), ResultCodeEnum.PARAM_ERROR, "新密码不能与原始密码相同");

        // 7. 加密新密码
        String encryptedNewPassword = PasswordUtil.encrypt(newPassword);

        // 8. 执行更新
        User updateUser = new User();
        updateUser.setId(userId);
        updateUser.setUserPassword(encryptedNewPassword);
        boolean updateResult = this.updateById(updateUser);
        ThrowUtils.throwIf(!updateResult, ResultCodeEnum.SERVER_ERROR, "用户密码更新失败，数据库更新异常");

        // 9. 密码更新后应主动使已有会话失效（强制重新登录）
        this.userLogout(request);

        // 10. 返回更新结果
        return true;
    }

    /**
     * 管理员添加用户
     *
     * @param adminAddUserRequest 管理员添加用户请求体
     * @return 添加成功的用户 ID
     */
    @Override
    public long adminAddUser(AdminAddUserRequest adminAddUserRequest) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(adminAddUserRequest), ResultCodeEnum.PARAM_ERROR, "用户添加请求不能为空");

        String userAccount = adminAddUserRequest.getUserAccount(); // 登陆账号
        String userPassword = adminAddUserRequest.getUserPassword(); // 登陆密码
        String checkPassword = adminAddUserRequest.getCheckPassword(); // 校验密码
        String planetCode = adminAddUserRequest.getPlanetCode(); // 星球编号

        // 基本参数校验
        this.validateRegisterParams(userAccount, userPassword, checkPassword, planetCode);

        // 校验登陆账号与星球编号唯一性
        this.validateUniqueFields(userAccount, planetCode);

        // 加密密码（使用 BCrypt，自动生成盐值）
        String encryptedPassword = PasswordUtil.encrypt(checkPassword);

        // 构建用户实体
        User user = new User();
        BeanUtils.copyProperties(adminAddUserRequest, user);
        user.setUserPassword(encryptedPassword);
        // 如果用户昵称未设置，则使用登录账号作为默认昵称
        if (user.getUserName() == null) {
            user.setUserName(userAccount);
        }
        // 如果用户角色未设置，则设置默认用户角色为普通用户
        if (user.getUserRole() == null) {
            user.setUserRole(UserRoleEnum.USER.getValue());
        }
        // 如果用户头像未设置，则使用默认头像
        if (user.getUserAvatar() == null) {
            user.setUserAvatar(UserConstant.USER_AVATAR_DEFAULT);
        }
        // 如果用户简介未设置，则使用默认简介
        if (user.getUserProfile() == null) {
            user.setUserProfile(UserConstant.USER_PROFILE_DEFAULT);
        }

        // 插入用户数据到数据库
        boolean saveResult = this.save(user);
        ThrowUtils.throwIf(!saveResult, ResultCodeEnum.SERVER_ERROR, "用户添加失败，数据库插入异常");

        // 返回新添加用户的 ID
        return user.getId();
    }

    /**
     * 管理员根据 id 获取用户信息
     *
     * @param adminGetUserRequest 管理员获取或删除用户请求体
     * @return 用户信息
     */
    @Override
    public User adminGetUserById(AdminGetOrDeleteUserRequest adminGetUserRequest) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(adminGetUserRequest), ResultCodeEnum.PARAM_ERROR, "用户获取或删除请求不能为空");
        Long userId = adminGetUserRequest.getId();
        ThrowUtils.throwIf(userId <= 0, ResultCodeEnum.PARAM_ERROR, "用户 ID 不合法");
        // 查询用户信息
        User user = this.getById(userId);
        ThrowUtils.throwIf(ObjectUtil.isEmpty(user), ResultCodeEnum.NOT_FOUND_ERROR, "用户不存在");
        return user;
    }

    /**
     * 管理员根据 id 删除用户
     *
     * @param adminDeleteUserRequest 管理员获取或删除用户请求体
     * @return 是否删除成功
     */
    @Override
    public boolean adminDeleteUserById(AdminGetOrDeleteUserRequest adminDeleteUserRequest) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(adminDeleteUserRequest), ResultCodeEnum.PARAM_ERROR, "用户获取或删除请求不能为空");
        Long userId = adminDeleteUserRequest.getId();
        ThrowUtils.throwIf(userId == null || userId <= 0, ResultCodeEnum.PARAM_ERROR, "用户 ID 不合法");
        // 删除用户
        boolean deleteResult = this.removeById(userId);
        ThrowUtils.throwIf(!deleteResult, ResultCodeEnum.SERVER_ERROR, "用户删除失败，数据库删除异常");
        return true;
    }

    /**
     * 管理员更新用户信息
     *
     * @param adminUpdateUserInfoRequest 管理员更新用户信息请求体
     * @return 是否更新成功
     */
    @Override
    public boolean adminUpdateUserInfo(AdminUpdateUserInfoRequest adminUpdateUserInfoRequest) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(adminUpdateUserInfoRequest), ResultCodeEnum.PARAM_ERROR, "用户信息更新请求不能为空");
        Long userId = adminUpdateUserInfoRequest.getId();
        ThrowUtils.throwIf(userId == null || userId <= 0, ResultCodeEnum.PARAM_ERROR, "用户 ID 不合法");
        // 构建更新实体
        User user = new User();
        String[] ignore = getNullPropertyNames(adminUpdateUserInfoRequest);
        BeanUtils.copyProperties(adminUpdateUserInfoRequest, user, ignore);
        // 执行更新
        boolean updateResult = this.updateById(user);
        ThrowUtils.throwIf(!updateResult, ResultCodeEnum.SERVER_ERROR, "用户信息更新失败，数据库更新异常");
        return true;
    }

    /**
     * 获取对象中值为 null 的属性名称数组
     *
     * @param source 源对象
     * @return 值为 null 的属性名称数组
     */
    private String[] getNullPropertyNames(Object source) {
        final BeanWrapper src = new BeanWrapperImpl(source);
        java.beans.PropertyDescriptor[] pds = src.getPropertyDescriptors();

        Set<String> emptyNames = new HashSet<>();
        for (PropertyDescriptor pd : pds) {
            Object srcValue = src.getPropertyValue(pd.getName());
            if (srcValue == null) {
                emptyNames.add(pd.getName());
            }
        }
        String[] result = new String[emptyNames.size()];
        return emptyNames.toArray(result);
    }

    /**
     * 管理员分页获取用户信息
     *
     * @param adminQueryUserRequest 管理员查询用户请求体
     * @return 分页的用户信息列表
     */
    @Override
    public Page<UserVO> adminGetUserInfoByPage(AdminQueryUserRequest adminQueryUserRequest) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(adminQueryUserRequest), ResultCodeEnum.PARAM_ERROR, "用户查询请求不能为空");
        int current = adminQueryUserRequest.getCurrent();
        int pageSize = adminQueryUserRequest.getPageSize();
        Page<User> userPage =
            this.page(new Page<>(current, pageSize), this.buildUserQueryWrapper(adminQueryUserRequest));
        // 将 User 实体转换为 UserVO 视图对象
        Page<UserVO> userVOPage = new Page<>(userPage.getCurrent(), userPage.getSize(), userPage.getTotal());
        List<UserVO> userVOList = this.getUserVOList(userPage.getRecords());
        userVOPage.setRecords(userVOList);
        return userVOPage;
    }

    /**
     * 将用户实体列表转换为用户视图对象列表
     *
     * @param userList 用户实体列表
     * @return 用户视图对象列表
     */
    private List<UserVO> getUserVOList(List<User> userList) {
        if (ObjectUtil.isEmpty(userList)) {
            return new ArrayList<>();
        }
        return userList.stream().map(this::getUserVO).toList();
    }

    /**
     * 构建用户查询包装器
     *
     * @param adminQueryUserRequest 用户查询请求体
     * @return 用户查询包装器
     */
    private QueryWrapper<User> buildUserQueryWrapper(AdminQueryUserRequest adminQueryUserRequest) {
        // 1. 参数校验
        ThrowUtils.throwIf(adminQueryUserRequest == null, ResultCodeEnum.PARAM_ERROR, "用户查询请求不能为空");

        // 2. 获取查询参数
        Long userId = adminQueryUserRequest.getId(); // 用户 ID
        String userAccount = adminQueryUserRequest.getUserAccount(); // 登录账号
        String userName = adminQueryUserRequest.getUserName(); // 用户昵称
        String userProfile = adminQueryUserRequest.getUserProfile(); // 用户简介
        String userRole = adminQueryUserRequest.getUserRole(); // 用户角色
        Integer userGender = adminQueryUserRequest.getUserGender(); // 用户性别
        String userPhone = adminQueryUserRequest.getUserPhone(); // 用户电话
        String userEmail = adminQueryUserRequest.getUserEmail(); // 用户邮箱
        Integer userStatus = adminQueryUserRequest.getUserStatus(); // 用户状态
        String planetCode = adminQueryUserRequest.getPlanetCode(); // 星球编号
        Date createTimeStart = adminQueryUserRequest.getCreateTimeStart(); // 创建时间起始
        Date createTimeEnd = adminQueryUserRequest.getCreateTimeEnd(); // 创建时间结束

        // 3. 构建查询包装器
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();

        // 精确匹配查询
        queryWrapper.eq(ObjectUtil.isNotEmpty(userId), UserConstant.USER_TABLE_FIELD_ID, userId)
            .eq(StrUtil.isNotBlank(userAccount), UserConstant.USER_TABLE_FIELD_USER_ACCOUNT, userAccount)
            .eq(StrUtil.isNotBlank(userRole), UserConstant.USER_TABLE_FIELD_USER_ROLE, userRole)
            .eq(ObjectUtil.isNotEmpty(userGender), UserConstant.USER_TABLE_FIELD_USER_GENDER, userGender)
            .eq(StrUtil.isNotBlank(userPhone), UserConstant.USER_TABLE_FIELD_USER_PHONE, userPhone)
            .eq(StrUtil.isNotBlank(userEmail), UserConstant.USER_TABLE_FIELD_USER_EMAIL, userEmail)
            .eq(ObjectUtil.isNotEmpty(userStatus), UserConstant.USER_TABLE_FIELD_USER_STATUS, userStatus)
            .eq(StrUtil.isNotBlank(planetCode), UserConstant.USER_TABLE_FIELD_PLANET_CODE, planetCode);

        // 模糊查询
        queryWrapper.like(StrUtil.isNotBlank(userName), UserConstant.USER_TABLE_FIELD_USER_NAME, userName)
            .like(StrUtil.isNotBlank(userProfile), UserConstant.USER_TABLE_FIELD_USER_PROFILE, userProfile);

        // 时间范围查询
        queryWrapper
            .ge(ObjectUtil.isNotEmpty(createTimeStart), UserConstant.USER_TABLE_FIELD_CREATE_TIME, createTimeStart)
            .le(ObjectUtil.isNotEmpty(createTimeEnd), UserConstant.USER_TABLE_FIELD_CREATE_TIME, createTimeEnd);

        // 4. 排序处理（防止 SQL 注入）
        String sortField = adminQueryUserRequest.getSortField(); // 排序字段
        String sortOrder = adminQueryUserRequest.getSortOrder(); // 排序方式
        if (StrUtil.isNotBlank(sortField)) {
            // 白名单校验
            Set<String> validSortFields = Set.of(UserConstant.USER_TABLE_FIELD_ID,
                UserConstant.USER_TABLE_FIELD_USER_ACCOUNT, UserConstant.USER_TABLE_FIELD_USER_NAME,
                UserConstant.USER_TABLE_FIELD_USER_PHONE, UserConstant.USER_TABLE_FIELD_USER_EMAIL,
                UserConstant.USER_TABLE_FIELD_PLANET_CODE, UserConstant.USER_TABLE_FIELD_CREATE_TIME);
            ThrowUtils.throwIf(!validSortFields.contains(sortField), ResultCodeEnum.PARAM_ERROR, "不支持的排序字段");
            // 排序方式
            boolean isAsc = SortOrderConstant.ASC.equals(sortOrder);
            queryWrapper.orderBy(true, isAsc, sortField);
        } else {
            // 默认按创建时间降序排序
            queryWrapper.orderByDesc(UserConstant.USER_TABLE_FIELD_CREATE_TIME);
        }

        // 5. 返回查询包装器
        return queryWrapper;
    }

    /**
     * 获得用户信息
     *
     * @param user 用户信息
     * @return 脱敏后的用户信息
     */
    private UserVO getUserVO(User user) {
        if (user == null) {
            return null;
        }
        UserVO userVO = new UserVO();
        BeanUtils.copyProperties(user, userVO);
        return userVO;
    }

    /**
     * 管理员重置用户密码
     *
     * @param adminResetUserPasswordRequest 管理员重置用户密码请求体
     * @return 是否重置成功
     */
    @Override
    public boolean adminResetUserPassword(AdminResetUserPasswordRequest adminResetUserPasswordRequest) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(adminResetUserPasswordRequest), ResultCodeEnum.PARAM_ERROR, "用户请求不能为空");
        Long userId = adminResetUserPasswordRequest.getId();
        ThrowUtils.throwIf(userId == null || userId <= 0, ResultCodeEnum.PARAM_ERROR, "用户 ID 不合法");

        User user = this.getById(userId);
        ThrowUtils.throwIf(ObjectUtil.isEmpty(user), ResultCodeEnum.NOT_FOUND_ERROR, "用户不存在");

        // 使用符合强度要求的默认密码重置（管理员可通知用户修改）
        String newPassword = adminResetUserPasswordRequest.getNewPassword();
        // 检验密码强度
        ThrowUtils.throwIf(!PasswordUtil.isValidStrong(newPassword), ResultCodeEnum.PARAM_ERROR,
            "重置密码强度不够，必须包含大写字母、小写字母、数字和特殊字符");
        // 加密密码
        String encryptedPassword = PasswordUtil.encrypt(newPassword);

        User updateUser = new User();
        updateUser.setId(userId);
        updateUser.setUserPassword(encryptedPassword);
        boolean updateResult = this.updateById(updateUser);
        ThrowUtils.throwIf(!updateResult, ResultCodeEnum.SERVER_ERROR, "重置密码失败，数据库更新异常");

        return true;
    }

    /**
     * 管理员封禁或解封用户
     *
     * @param adminBanOrUnbanUserRequest 管理员获取或删除用户请求体
     * @return 是否操作成功
     */
    @Override
    public boolean adminBanOrUnbanUser(AdminBanOrUnbanUserRequest adminBanOrUnbanUserRequest) {
        // 1. 参数校验
        ThrowUtils.throwIf(ObjectUtil.isEmpty(adminBanOrUnbanUserRequest), ResultCodeEnum.PARAM_ERROR, "用户封禁或解封请求不能为空");
        Long userId = adminBanOrUnbanUserRequest.getId();
        Integer userStatus = adminBanOrUnbanUserRequest.getUserStatus();
        ThrowUtils.throwIf(userId == null || userId <= 0, ResultCodeEnum.PARAM_ERROR, "用户 ID 不合法");
        ThrowUtils.throwIf(userStatus == null, ResultCodeEnum.PARAM_ERROR, "用户状态不能为空");
        ThrowUtils.throwIf(userStatus != 0 && userStatus != 1, ResultCodeEnum.PARAM_ERROR, "用户状态不合法");

        // 2. 查询用户是否存在
        User user = this.getById(userId);
        ThrowUtils.throwIf(ObjectUtil.isEmpty(user), ResultCodeEnum.NOT_FOUND_ERROR, "用户不存在");

        // 3. 检查用户当前状态是否与请求状态相同
        Integer currentStatus = user.getUserStatus();
        if (currentStatus != null && currentStatus.equals(userStatus)) {
            String statusDesc = (userStatus == 0) ? "解封" : "封禁";
            throw new BusinessException(ResultCodeEnum.PARAM_ERROR, "用户已处于" + statusDesc + "状态，无需重复操作");
        }

        // 4. 执行封禁或解封操作
        User updateUser = new User();
        updateUser.setId(userId);
        updateUser.setUserStatus(userStatus);
        boolean updateResult = this.updateById(updateUser);
        ThrowUtils.throwIf(!updateResult, ResultCodeEnum.SERVER_ERROR, "用户封禁或解封失败，数据库更新异常");

        // 5. 返回操作结果
        return true;
    }

}
