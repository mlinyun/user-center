package com.mlinyun.usercenter.service.user;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.mlinyun.usercenter.common.ResultCodeEnum;
import com.mlinyun.usercenter.constant.UserConstant;
import com.mlinyun.usercenter.exception.BusinessException;
import com.mlinyun.usercenter.mapper.UserMapper;
import com.mlinyun.usercenter.model.dto.UserLoginRequest;
import com.mlinyun.usercenter.model.entity.User;
import com.mlinyun.usercenter.model.vo.UserLoginVO;
import com.mlinyun.usercenter.service.impl.UserServiceImpl;
import com.mlinyun.usercenter.utils.PasswordUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
@DisplayName("用户登录服务测试")
class UserLoginTest {

    @InjectMocks
    private UserServiceImpl userService;

    @Mock
    private UserMapper mockUserMapper;

    @Mock
    private HttpServletRequest mockRequest;

    @Mock
    private HttpSession mockSession;

    // 模拟的用户 ID
    private static final Long USER_ID = 1899878538809757698L;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(userService, "baseMapper", mockUserMapper);
    }

    /**
     * 构建用户登录请求体
     *
     * @param userAccount 登录账号
     * @param userPassword 登录密码
     * @return 用户登录请求体
     */
    private UserLoginRequest buildLoginRequest(String userAccount, String userPassword) {
        UserLoginRequest loginRequest = new UserLoginRequest();
        loginRequest.setUserAccount(userAccount);
        loginRequest.setUserPassword(userPassword);
        return loginRequest;
    }

    /**
     * 验证业务异常
     *
     * @param runnable 可执行的代码块
     * @param expectedCode 预期的错误码
     * @param expectedMessage 预期的错误信息
     */
    private void assertBusinessException(Runnable runnable, ResultCodeEnum expectedCode, String expectedMessage) {
        BusinessException exception = assertThrows(BusinessException.class, runnable::run);
        assertEquals(expectedCode.getCode(), exception.getCode());
        assertEquals(expectedMessage, exception.getMessage());
    }

    @Test
    @DisplayName("测试正常用户登录")
    void testUserLoginSuccess() {
        when(mockRequest.getSession()).thenReturn(mockSession);

        String rawPassword = "Password..1234";
        String encryptedPassword = PasswordUtil.encrypt(rawPassword);

        User userInDb = new User();
        userInDb.setId(USER_ID);
        userInDb.setUserAccount("LingYun");
        userInDb.setUserPassword(encryptedPassword);

        // 模拟数据库查询到的用户
        when(mockUserMapper.selectOne(any(QueryWrapper.class))).thenReturn(userInDb);

        // 构造用户登录请求体
        UserLoginRequest loginRequest = buildLoginRequest("LingYun", rawPassword);

        // 调用用户登录方法
        UserLoginVO resultUser = userService.userLogin(loginRequest, mockRequest);

        // 验证结果
        assertNotNull(resultUser); // 确保返回的用户信息不为空
        assertEquals(USER_ID, resultUser.getId()); // 验证用户 ID

        verify(mockUserMapper).selectOne(any(QueryWrapper.class));
        verify(mockSession).setAttribute(UserConstant.USER_LOGIN_STATE, userInDb);
    }

    @Test
    @DisplayName("测试用户登录请求体为空")
    void testUserLoginWithNullRequest() {
        // 模拟登录请求体为空
        assertBusinessException(() -> userService.userLogin(null, mockRequest), ResultCodeEnum.PARAM_ERROR,
            "用户登录请求体不能为空");
    }

    @Test
    @DisplayName("测试用户登录账号为空")
    void testUserLoginWithEmptyAccount() {
        // 模拟登录请求体中的账号为空
        UserLoginRequest loginRequest = buildLoginRequest("", "Password..1234");
        assertBusinessException(() -> userService.userLogin(loginRequest, mockRequest), ResultCodeEnum.PARAM_ERROR,
            "必填参数不能为空");
    }

    @Test
    @DisplayName("测试用户登录密码为空")
    void testLoginWithEmptyPassword() {
        // 模拟登录请求体中的密码为空
        UserLoginRequest loginRequest = buildLoginRequest("LingYun", "");
        assertBusinessException(() -> userService.userLogin(loginRequest, mockRequest), ResultCodeEnum.PARAM_ERROR,
            "必填参数不能为空");
    }

    @Test
    @DisplayName("测试用户登录账号长度不合法")
    void testUserLoginWithInvalidAccountLength() {
        // 模拟登录请求体中的账号长度不合法
        UserLoginRequest loginRequest = buildLoginRequest("L", "Password..1234");
        assertBusinessException(() -> userService.userLogin(loginRequest, mockRequest), ResultCodeEnum.PARAM_ERROR,
            "登录账号长度不合法（范围 4-16 位）");
    }

    @Test
    @DisplayName("测试登陆时登录账号包含特殊字符")
    void testUserLoginWithInvalidUserAccount() {
        // 模拟登录请求体中的账号包含特殊字符
        UserLoginRequest loginRequest = buildLoginRequest("Ling@Yun", "password1234");
        assertBusinessException(() -> userService.userLogin(loginRequest, mockRequest), ResultCodeEnum.PARAM_ERROR,
            "登录账号只能包含字母、数字和下划线");
    }

    @Test
    @DisplayName("测试用户登录密码长度不合法")
    void testUserLoginWithInvalidPasswordLength() {
        // 模拟登录请求体中的密码长度不合法
        UserLoginRequest loginRequest = buildLoginRequest("LingYun", "123");
        assertBusinessException(() -> userService.userLogin(loginRequest, mockRequest), ResultCodeEnum.PARAM_ERROR,
            "登录密码长度不合法（范围 8-20 位）");
    }

    @Test
    @DisplayName("测试用户登录账号不存在或密码错误")
    void testLoginWithNonExistentAccount() {
        // 模拟登录请求体中的账号不存在
        UserLoginRequest loginRequest = buildLoginRequest("NonExistentUser", "Password..1234");

        when(mockUserMapper.selectOne(any(QueryWrapper.class))).thenReturn(null);
        assertBusinessException(() -> userService.userLogin(loginRequest, mockRequest), ResultCodeEnum.PARAM_ERROR,
            "用户不存在或密码错误");

        verify(mockUserMapper).selectOne(any(QueryWrapper.class));
    }

}
