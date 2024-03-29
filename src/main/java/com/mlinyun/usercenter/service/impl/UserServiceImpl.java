package com.mlinyun.usercenter.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.mlinyun.usercenter.common.ErrorCode;
import com.mlinyun.usercenter.exception.BusinessException;
import com.mlinyun.usercenter.model.domain.User;
import com.mlinyun.usercenter.service.UserService;
import com.mlinyun.usercenter.mapper.UserMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static com.mlinyun.usercenter.constant.UserConstant.ADMIN_ROLE;
import static com.mlinyun.usercenter.constant.UserConstant.USER_LOGIN_STATE;

/**
 * 用户服务实现类
 *
 * @author LinCanhui
 * @description 针对表【user(用户)】的数据库操作Service实现
 * @createDate 2024-01-29 22:18:17
 */
@Slf4j
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Resource
    private UserMapper userMapper;

    /**
     * 盐值，用于混淆密码
     */
    private static final String SALT = "mlinyun";

    /**
     * 用户注册服务实现
     *
     * @param userAccount   用户账号
     * @param userPassword  用户密码
     * @param checkPassword 校验密码
     * @return 新用户 id
     */
    @Override
    public long userRegister(String userAccount, String userPassword, String checkPassword, String planetCode) {
        // 1. 校验
        // 1.1 校验是否为空 引入apache common utils ：Apache Commons Lang 使用其中的方法：isAnyBlank 可判断多个字符串是否为空
        if (StringUtils.isAnyBlank(userAccount, userPassword, checkPassword, planetCode)) {
            throw new BusinessException(ErrorCode.PARAMS_NULL, "请求参数为空");
        }
        // 1.2 校验账号位数（账户长度范围 4-16位）
        if (userAccount.length() < 4 || userAccount.length() > 16) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "用户账号长度不符合要求");
        }
        // 1.3 校验密码位数（密码长度范围 8-16位）
        if (userPassword.length() < 8 || checkPassword.length() < 8 || userPassword.length() > 16 || checkPassword.length() > 16) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "用户密码长度不符合要求");
        }
        // 1.7 校验星球编号长度
        if (planetCode.length() > 5) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "星球编号不对");
        }
        // 1.4 校验账号不包含特殊字符
        String validPattern = "[\\u00A0\\s\"`~!@#$%^&*()+=|{}':;',\\[\\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“'。，、？]";
        Matcher matcher = Pattern.compile(validPattern).matcher(userAccount);
        if (matcher.find()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "用户账号不能包含特殊字符");
        }
        // 1.5 校验密码和校验密码是否相同
        if (!userPassword.equals(checkPassword)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "两次输入密码不一致");
        }
        // 1.6 账户不能重复（需要查询数据库中的用户表是否存在此用户）
        // 这一步放在最后，当其他校验通过时，再去数据库查询账号是否存在，这样可以防止性能浪费
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("userAccount", userAccount);
        long count = userMapper.selectCount(queryWrapper);
        if (count > 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "该账号已被注册");
        }
        // 1.8 星球编号不能重复
        queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("planetCode", planetCode);
        count = userMapper.selectCount(queryWrapper);
        if (count > 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "星球编号不能重复");
        }

        // 2. 密码加密
        // 使用 String 的加密方法，采用 MD5 加密方式
        String encryptPassword = DigestUtils.md5DigestAsHex((SALT + userPassword).getBytes(StandardCharsets.UTF_8));

        // 3. 向数据库插入用户数据
        User user = new User();
        user.setUserAccount(userAccount);
        user.setUserPassword(encryptPassword);
        user.setPlanetCode(planetCode);
        boolean saveResult = this.save(user);
        if (!saveResult) {
            throw new RuntimeException(ErrorCode.SYSTEM_ERROR.getMessage());
        }
        // 4. 返回新用户 id
        return user.getId();
    }

    /**
     * 用户登录服务实现
     *
     * @param userAccount  用户账号
     * @param userPassword 用户密码
     * @param request      请求
     * @return 脱敏后的用户信息
     */
    @Override
    public User userLogin(String userAccount, String userPassword, HttpServletRequest request) {
        // 1. 校验
        // 1.1 校验是否为空 引入apache common utils ：Apache Commons Lang 使用其中的方法：isAnyBlank 可判断多个字符串是否为空
        if (StringUtils.isAnyBlank(userAccount, userPassword)) {
            throw new BusinessException(ErrorCode.PARAMS_NULL, "请求参数为空");
        }
        // 1.2 校验账号位数（账户长度范围 4-16位）
        if (userAccount.length() < 4 || userAccount.length() > 16) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "用户账号长度不符合要求");
        }
        // 1.3 校验密码位数（密码长度范围 8-16位）
        if (userPassword.length() < 8 || userPassword.length() > 16) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "用户密码长度不符合要求");
        }
        // 1.4 校验账号不包含特殊字符
        String validPattern = "[\\u00A0\\s\"`~!@#$%^&*()+=|{}':;',\\[\\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“'。，、？]";
        Matcher matcher = Pattern.compile(validPattern).matcher(userAccount);
        if (matcher.find()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "用户账号不能包含特殊字符");
        }

        // 2. 密码加密
        // 使用 String 的加密方法，采用 MD5 加密方式
        String encryptPassword = DigestUtils.md5DigestAsHex((SALT + userPassword).getBytes(StandardCharsets.UTF_8));

        // 3. 查询用户是否存在
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("userAccount", userAccount);
        // 注意：这里要用 encryptPassword，因为数据库中存储的是加密之后的密码
        queryWrapper.eq("userPassword", encryptPassword);
        User user = userMapper.selectOne(queryWrapper);
        // 用户不存在
        if (user == null) {
            log.info("user login failed, userAccount cannot match userPassword");
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "用户账号不存在或密码不正确");
        }

        // 4. 用户信息脱敏
        User safetyUser = getSafetyUser(user);

        // 5. 记录用户的登录态
        request.getSession().setAttribute(USER_LOGIN_STATE, safetyUser);

        // 返回脱敏后的用户信息
        return safetyUser;
    }

    /**
     * 用户信息脱敏方法
     *
     * @param originUser 要脱敏的 user 对象
     * @return 脱敏后的用户信息
     */
    @Override
    public User getSafetyUser(User originUser) {
        // 判空
        if (originUser == null) {
            return null;
        }
        User safetyUser = new User();
        safetyUser.setId(originUser.getId());
        safetyUser.setUsername(originUser.getUsername());
        safetyUser.setUserAccount(originUser.getUserAccount());
        safetyUser.setAvatarUrl(originUser.getAvatarUrl());
        safetyUser.setGender(originUser.getGender());
        safetyUser.setPhone(originUser.getPhone());
        safetyUser.setEmail(originUser.getEmail());
        safetyUser.setUserStatus(originUser.getUserStatus());
        safetyUser.setCreateTime(originUser.getCreateTime());
        safetyUser.setUserRole(originUser.getUserRole());
        safetyUser.setPlanetCode(originUser.getPlanetCode());
        return safetyUser;
    }

    /**
     * 查询用户服务实现
     *
     * @param username 用户名
     * @param request  请求
     * @return 查询到的用户
     */
    @Override
    public List<User> searchUsers(String username, HttpServletRequest request) {
        // 仅管理员可以查询
        if (!isAdmin(request)) {
            throw new BusinessException(ErrorCode.NO_AUTH, "缺少管理员权限");
        }
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        if (StringUtils.isNotBlank(username)) {
            queryWrapper.like("username", username);
        }
        List<User> userList = userMapper.selectList(queryWrapper);
        return userList.stream().map(user -> {
            user.setUserPassword(null);
            return getSafetyUser(user);
        }).collect(Collectors.toList());
    }

    /**
     * 删除用户服务实现
     *
     * @param id      要删除用户 id
     * @param request 请求
     * @return boolean 删除结果（true - 删除成功 false - 删除失败）
     */
    @Override
    public boolean deleteUser(long id, HttpServletRequest request) {
        // 仅管理员可删除
        if (!isAdmin(request)) {
            throw new BusinessException(ErrorCode.NO_AUTH, "缺少管理员权限");
        }
        if (id < 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "id 小于 0");
        }
        return userMapper.deleteById(id) > 0;
    }

    /**
     * 获取当前用户信息服务实现
     *
     * @param request 请求
     * @return 当前登录的用户信息
     */
    @Override
    public User getCurrentUser(HttpServletRequest request) {
        Object userObj = request.getSession().getAttribute(USER_LOGIN_STATE);
        User currentUser = (User) userObj;
        if (currentUser == null) {
            throw new BusinessException(ErrorCode.NOT_LOGIN, "用户未登录");
        }
        Long userId = currentUser.getId();
        // TODO 校验用户是否合法
        User user = userMapper.selectById(userId);
        return getSafetyUser(user);
    }

    /**
     * 用户注销服务实现
     *
     * @param request 请求
     * @return true - 注销成功 false - 注销失败
     */
    @Override
    public boolean userLogout(HttpServletRequest request) {
        // 移除登录态
        request.getSession().removeAttribute(USER_LOGIN_STATE);
        return true;
    }

    /**
     * 鉴权函数：判断是否为管理员
     *
     * @param request 请求
     * @return boolean（true - 管理员 false - 非管理员）
     */
    public boolean isAdmin(HttpServletRequest request) {
        Object userObj = request.getSession().getAttribute(USER_LOGIN_STATE);
        User user = (User) userObj;
        return user != null && user.getUserRole() == ADMIN_ROLE;
    }
}
