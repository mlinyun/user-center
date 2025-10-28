package com.mlinyun.usercenter.service.user;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.mlinyun.usercenter.constant.UserConstant;
import com.mlinyun.usercenter.exception.BusinessException;
import com.mlinyun.usercenter.model.entity.User;
import com.mlinyun.usercenter.service.impl.UserServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.Date;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
@DisplayName("用户登出服务测试")
class UserLogoutTest {

    @Spy
    @InjectMocks
    private UserServiceImpl userService;

    @Mock
    private HttpServletRequest mockRequest;

    @Mock
    private HttpSession mockSession;

    // 模拟的用户 ID
    private static final Long USER_ID = 1899878538809757698L;

    @Test
    @DisplayName("测试用户正常登出")
    void testUserLogout() {
        Date currentDate = new Date();
        User sessionUser = new User();
        sessionUser.setId(USER_ID);
        sessionUser.setUserAccount("LingYun");
        sessionUser.setUserPassword("Password..1234");
        sessionUser.setUserName("凌云");
        sessionUser.setUserAvatar("https://example.com/avatar.jpg");
        sessionUser.setUserProfile("一名普通的测试开发人员");
        sessionUser.setUserRole("admin");
        sessionUser.setUserGender(1);
        sessionUser.setUserPhone("12345678901");
        sessionUser.setUserEmail("lingyun123@gmail.com");
        sessionUser.setUserStatus(0);
        sessionUser.setPlanetCode("00101");
        sessionUser.setEditTime(currentDate);
        sessionUser.setCreateTime(currentDate);
        sessionUser.setUpdateTime(currentDate);
        sessionUser.setIsDelete(0);

        // 模拟 HttpServletRequest 和 HttpSession 的行为
        when(mockRequest.getSession()).thenReturn(mockSession);
        // 模拟获取会话中的登录用户
        when(mockSession.getAttribute(UserConstant.USER_LOGIN_STATE)).thenReturn(sessionUser);
        // 模拟从会话中移除登录用户
        doNothing().when(mockSession).removeAttribute(UserConstant.USER_LOGIN_STATE);

        // 调用用户登出方法
        boolean result = userService.userLogout(mockRequest);

        // 验证返回值
        assertTrue(result);

        // 验证会话中登录用户被移除
        verify(mockSession).removeAttribute(UserConstant.USER_LOGIN_STATE);
    }

    @Test
    @DisplayName("测试用户登出时会话没有登录用户")
    void testUserLogoutWithoutLogin() {
        // 模拟 HttpServletRequest 和 HttpSession 的行为
        when(mockRequest.getSession()).thenReturn(mockSession);
        // 模拟会话中没有登录用户
        when(mockSession.getAttribute(UserConstant.USER_LOGIN_STATE)).thenReturn(null);

        Exception exception = assertThrows(BusinessException.class, () -> userService.userLogout(mockRequest));

        // 验证异常信息
        assertEquals("操作失败，用户未登录", exception.getMessage());

        // 验证会话中登录用户没有被移除
        verify(mockSession, never()).removeAttribute(UserConstant.USER_LOGIN_STATE);
    }
}
