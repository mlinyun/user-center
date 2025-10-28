package com.mlinyun.usercenter.service.user;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.mlinyun.usercenter.common.ResultCodeEnum;
import com.mlinyun.usercenter.constant.UserConstant;
import com.mlinyun.usercenter.exception.BusinessException;
import com.mlinyun.usercenter.mapper.UserMapper;
import com.mlinyun.usercenter.model.entity.User;
import com.mlinyun.usercenter.service.impl.UserServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.Date;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
@DisplayName("获取登录用户信息测试")
class GetLoginUserInfoTest {

    @Spy
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

    private User buildMockUser() {
        Date currentDate = new Date();
        User mockUser = new User();
        mockUser.setId(USER_ID);
        mockUser.setUserAccount("LingYun");
        mockUser.setUserPassword("Password..1234");
        mockUser.setUserName("凌云");
        mockUser.setUserAvatar("https://example.com/avatar.jpg");
        mockUser.setUserProfile("一名普通的测试开发人员");
        mockUser.setUserRole("admin");
        mockUser.setUserGender(1);
        mockUser.setUserPhone("12345678901");
        mockUser.setUserEmail("lingyun123@gmail.com");
        mockUser.setUserStatus(0);
        mockUser.setPlanetCode("00101");
        mockUser.setEditTime(currentDate);
        mockUser.setCreateTime(currentDate);
        mockUser.setUpdateTime(currentDate);
        mockUser.setIsDelete(0);
        return mockUser;
    }

    @Test
    @DisplayName("测试正常获取登录用户信息")
    void testGetLoginUserSuccess() {
        // 构建模拟用户
        User sessionUser = buildMockUser();
        // 模拟请求和会话
        when(mockRequest.getSession()).thenReturn(mockSession);
        // 模拟获取会话中的登录用户
        when(mockSession.getAttribute(UserConstant.USER_LOGIN_STATE)).thenReturn(sessionUser);
        // 模拟数据库查询
        when(mockUserMapper.selectById(USER_ID)).thenReturn(sessionUser);

        // 调用方法
        User result = userService.getLoginUser(mockRequest);

        // 验证结果
        assertNotNull(result, "获取的用户信息不应为 null");
        assertEquals(USER_ID, result.getId(), "用户 ID 不匹配");

        verify(mockRequest, times(1)).getSession();
        verify(mockSession, times(1)).getAttribute(UserConstant.USER_LOGIN_STATE);
        verify(mockUserMapper, times(1)).selectById(USER_ID);
    }

    @Test
    @DisplayName("测试用户未登录获取登录用户信息")
    void testGetLoginUserNotLoggedIn() {
        // 模拟请求和会话
        when(mockRequest.getSession()).thenReturn(mockSession);
        // 模拟获取会话中的登录用户为 null
        when(mockSession.getAttribute(UserConstant.USER_LOGIN_STATE)).thenReturn(null);

        assertBusinessException(() -> userService.getLoginUser(mockRequest), ResultCodeEnum.NOT_LOGIN_ERROR, "未登录");

        verify(mockRequest, times(1)).getSession();
        verify(mockSession, times(1)).getAttribute(UserConstant.USER_LOGIN_STATE);
    }

    @Test
    @DisplayName("测试用户 ID 为空获取登录用户信息")
    void testGetLoginUserIdNull() {
        // 构建模拟用户，但 id 为 null
        User sessionUser = buildMockUser();
        sessionUser.setId(null);
        // 模拟请求和会话
        when(mockRequest.getSession()).thenReturn(mockSession);
        // 模拟获取会话中的登录用户
        when(mockSession.getAttribute(UserConstant.USER_LOGIN_STATE)).thenReturn(sessionUser);

        assertBusinessException(() -> userService.getLoginUser(mockRequest), ResultCodeEnum.NOT_LOGIN_ERROR, "未登录");

        verify(mockRequest, times(1)).getSession();
        verify(mockSession, times(1)).getAttribute(UserConstant.USER_LOGIN_STATE);
    }

    @Test
    @DisplayName("测试数据库查询异常获取登录用户信息")
    void testGetLoginUserDatabaseError() {
        // 构建模拟用户
        User sessionUser = buildMockUser();
        // 模拟请求和会话
        when(mockRequest.getSession()).thenReturn(mockSession);
        // 模拟获取会话中的登录用户
        when(mockSession.getAttribute(UserConstant.USER_LOGIN_STATE)).thenReturn(sessionUser);
        // 模拟数据库查询异常
        when(mockUserMapper.selectById(USER_ID)).thenThrow(new BusinessException(ResultCodeEnum.SERVER_ERROR));

        assertBusinessException(() -> userService.getLoginUser(mockRequest), ResultCodeEnum.SERVER_ERROR, "服务器内部错误");

        verify(mockRequest, times(1)).getSession();
        verify(mockSession, times(1)).getAttribute(UserConstant.USER_LOGIN_STATE);
        verify(mockUserMapper, times(1)).selectById(USER_ID);
    }

    @Test
    @DisplayName("测试获取登录用户信息时用户不存在")
    void testGetLoginUserNotFound() {
        // 构建模拟用户
        User sessionUser = buildMockUser();
        // 模拟请求和会话
        when(mockRequest.getSession()).thenReturn(mockSession);
        // 模拟获取会话中的登录用户
        when(mockSession.getAttribute(UserConstant.USER_LOGIN_STATE)).thenReturn(sessionUser);
        // 模拟数据库查询返回 null
        when(mockUserMapper.selectById(USER_ID)).thenReturn(null);

        assertBusinessException(() -> userService.getLoginUser(mockRequest), ResultCodeEnum.NOT_LOGIN_ERROR, "未登录");

        verify(mockRequest, times(1)).getSession();
        verify(mockSession, times(1)).getAttribute(UserConstant.USER_LOGIN_STATE);
        verify(mockUserMapper, times(1)).selectById(USER_ID);
    }

}
