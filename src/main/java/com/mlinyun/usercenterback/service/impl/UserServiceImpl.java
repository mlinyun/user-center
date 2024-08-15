package com.mlinyun.usercenterback.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.mlinyun.usercenterback.mapper.UserMapper;
import com.mlinyun.usercenterback.model.domain.User;
import com.mlinyun.usercenterback.service.UserService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
* @author LinCanhui
* @description 针对表【user(用户)】的数据库操作Service实现
* @createDate 2024-08-14 17:32:13
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

    public UserServiceImpl(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    /**
     * 用户登录态键
     */
    private static final String USER_LOGIN_STATE = "userLoginState";

    /**
     * 用户注册
     *
     * @param userAccount   用户账号
     * @param userPassword  用户密码
     * @param checkPassword 校验密码
     * @param planetCode    星球编号
     * @return 新注册的用户 id
     */
    @Override
    public long userRegister(String userAccount, String userPassword, String checkPassword, String planetCode) {
        // 1. 校验
        // 1.1 校验是否为空 引入apache common utils ：Apache Commons Lang 使用其中的方法：isAnyBlank 可判断多个字符串是否为空
        if (StringUtils.isAnyBlank(userAccount, userPassword, checkPassword, planetCode)) {
            // TODO 修改为自定义异常（请求参数为空）
            return -1;
        }
        // 1.2 校验账号位数（账户长度范围 4-16位）
        if (userAccount.length() < 4 || userAccount.length() > 16) {
            // TODO 修改为自定义异常（用户账号长度不符合要求）
            return -1;
        }
        // 1.3 校验密码位数（密码长度范围 8-16位）
        if (userPassword.length() < 8 || userPassword.length() > 16 || checkPassword.length() < 8 || checkPassword.length() > 16) {
            // TODO 修改为自定义异常（用户密码长度不符合要求）
            return -1;
        }
        // 1.4 校验星球编号长度
        if (planetCode.length() > 5) {
            // TODO 修改为自定义异常（星球编号不对）
            return -1;
        }
        // 1.5 校验账号不包含特殊字符
        String validPattern = "[\\u00A0\\s\"`~!@#$%^&*()+=|{}':;',\\[\\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“'。，、？]";
        Matcher matcher = Pattern.compile(validPattern).matcher(userAccount);
        if (matcher.find()) {
            // TODO 修改为自定义异常（用户账号不能包含特殊字符）
            return -1;
        }
        // 1.6 判断密码和校验密码是否相同
        if (!userPassword.equals(checkPassword)) {
            // TODO 修改为自定义异常（两次输入密码不一致）
            return -1;
        }
        // 1.7 账户不能重复（需要查询数据库中的用户表是否存在此用户）
        // 这一步放在最后，当其他校验通过时，再去数据库查询账号是否存在，这样可以防止性能浪费
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("userAccount", userAccount);
        long count = userMapper.selectCount(queryWrapper);
        if (count > 0) {
            // TODO 修改为自定义异常（该账号已被注册）
            return -1;
        }
        // 1.8 星球编号不能重复
        queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("planetCode", planetCode);
        count = userMapper.selectCount(queryWrapper);
        if (count > 0) {
            // TODO 修改为自定义异常（星球编号不能重复）
            return -1;
        }

        // 2. 密码加密：使用 String 的加密方法，采用 MD5 加密方式
        String encryptPassword = DigestUtils.md5DigestAsHex((SALT + userPassword).getBytes(StandardCharsets.UTF_8));

        // 3. 向数据库插入用户数据
        User user = new User();
        user.setUserAccount(userAccount);
        user.setUserPassword(encryptPassword); // 注意这里存储的是加密之后的密码
        user.setPlanetCode(planetCode);
        boolean saveResult = this.save(user);
        if (!saveResult) {
            // TODO 修改为自定义异常（系统内部异常）
            return -1;
        }

        // 4. 返回新用户 id
        return user.getId();
    }

    /**
     * 用户登录
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
            // TODO 修改为自定义异常（请求参数为空）
            return null;
        }
        // 1.2 校验账号位数（账户长度范围 4-16位）
        if (userAccount.length() < 4 || userAccount.length() > 16) {
            // TODO 修改为自定义异常（用户账号长度不符合要求）
            return null;
        }
        // 1.3 校验密码位数（密码长度范围 8-16位）
        if (userPassword.length() < 8 || userPassword.length() > 16) {
            // TODO 修改为自定义异常（用户密码长度不符合要求）
            return null;
        }
        // 1.4 校验账号不包含特殊字符
        String validPattern = "[\\u00A0\\s\"`~!@#$%^&*()+=|{}':;',\\[\\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“'。，、？]";
        Matcher matcher = Pattern.compile(validPattern).matcher(userAccount);
        if (matcher.find()) {
            // TODO 修改为自定义异常（用户账号不能包含特殊字符）
            return null;
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
            // TODO 修改为自定义异常（用户账号不存在或密码不正确）
            return null;
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
            // TODO 修改为自定义异常（参数为空）
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
}
