package com.mlinyun.usercenter.service.user;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import cn.hutool.core.util.RandomUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.mlinyun.usercenter.common.ResultCodeEnum;
import com.mlinyun.usercenter.exception.BusinessException;
import com.mlinyun.usercenter.mapper.UserMapper;
import com.mlinyun.usercenter.model.dto.UserRegisterRequest;
import com.mlinyun.usercenter.model.entity.User;
import com.mlinyun.usercenter.service.impl.UserServiceImpl;
import com.mlinyun.usercenter.utils.PasswordUtil;
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
@DisplayName("用户注册服务测试")
class UserRegisterTest {

    @Spy
    @InjectMocks
    private UserServiceImpl userService;

    @Mock
    private UserMapper mockUserMapper;

    @BeforeEach
    void setUp() {
        // 手动设置 baseMapper
        ReflectionTestUtils.setField(userService, "baseMapper", mockUserMapper);
    }

    // 随机生成的用户名和密码长度
    private static final int MAX_LENGTH = 21;

    /**
     * 构建用户注册请求体
     *
     * @param userAccount 登录账号
     * @param userPassword 登录密码
     * @param checkPassword 校验密码
     * @return 用户注册请求体
     */
    private UserRegisterRequest buildUserRegisterRequest(String userAccount, String userPassword, String checkPassword,
        String planetCode) {
        UserRegisterRequest userRegisterRequest = new UserRegisterRequest();
        userRegisterRequest.setUserAccount(userAccount);
        userRegisterRequest.setUserPassword(userPassword);
        userRegisterRequest.setCheckPassword(checkPassword);
        userRegisterRequest.setPlanetCode(planetCode);
        return userRegisterRequest;
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
        verify(mockUserMapper, never()).selectCount(any()); // 验证查询方法未被调用
        verify(userService, never()).save(any(User.class)); // 验证保存方法未被调用
    }

    @Test
    @DisplayName("测试正常用户注册")
    void testUserRegisterSuccess() {
        // 构建用户注册请求体
        UserRegisterRequest validRequest =
            buildUserRegisterRequest("LingYun", "Password..1234", "Password..1234", "00003");

        // 模拟数据库查询返回 0 条记录
        when(mockUserMapper.selectCount(any())).thenReturn(0L);

        // 使用 MyBatis Plus 的 ID 生成器 IdWorker 生成一个雪花算法 ID
        long generatedUserId = IdWorker.getId();

        // 模拟 save 方法并设置 User ID - 使用 MyBatis Plus 的 ID 生成器
        doAnswer(invocationOnMock -> {
            User user = invocationOnMock.getArgument(0);
            if (user.getId() == null) {
                user.setId(generatedUserId);
            }
            return true;
        }).when(userService).save(any(User.class));

        // 调用注册方法
        long userId = userService.userRegister(validRequest);

        // 验证结果
        assertEquals(generatedUserId, userId); // 验证返回的用户 ID 是否与生成的 ID 相同

        // 验证方法是否被调用
        verify(mockUserMapper).selectCount(any()); // 验证查询方法被调用
        verify(userService).save(any(User.class)); // 验证保存方法被调用
    }

    @Test
    @DisplayName("测试注册时请求体为空")
    void testUserRegisterWithNullRequest() {
        assertBusinessException(() -> userService.userRegister(null), ResultCodeEnum.PARAM_ERROR, "用户注册请求体不能为空");
    }

    @Test
    @DisplayName("测试注册时请求体字段为空")
    void testUserRegisterWithEmptyFields() {
        UserRegisterRequest emptyFieldsRequest = buildUserRegisterRequest("", "password1234", "password1234", "00004");
        assertBusinessException(() -> userService.userRegister(emptyFieldsRequest), ResultCodeEnum.PARAM_ERROR,
            "必填参数不能为空");
    }

    @Test
    @DisplayName("测试注册时登录账号太短")
    void testUserRegisterWithShortUserAccount() {
        UserRegisterRequest shortUserAccountRequest =
            buildUserRegisterRequest("abc", "Password..1234", "Password..1234", "00005");
        assertBusinessException(() -> userService.userRegister(shortUserAccountRequest), ResultCodeEnum.PARAM_ERROR,
            "登录账号长度不合法（范围 4-16 位）");
    }

    @Test
    @DisplayName("测试注册时登录账号太长")
    void testUserRegisterWithLongUserAccount() {
        UserRegisterRequest longUserAccountRequest =
            buildUserRegisterRequest(RandomUtil.randomString(MAX_LENGTH), "Password..123", "Password..123", "00006");
        assertBusinessException(() -> userService.userRegister(longUserAccountRequest), ResultCodeEnum.PARAM_ERROR,
            "登录账号长度不合法（范围 4-16 位）");
    }

    @Test
    @DisplayName("测试注册时登录账号包含特殊字符")
    void testUserRegisterWithInvalidUserAccount() {
        UserRegisterRequest invalidUserAccountRequest =
            buildUserRegisterRequest("test@user", "Password..123", "Password..123", "00007");
        assertBusinessException(() -> userService.userRegister(invalidUserAccountRequest), ResultCodeEnum.PARAM_ERROR,
            "登录账号只能包含字母、数字和下划线");
    }

    @Test
    @DisplayName("测试注册时密码太短")
    void testUserRegisterWithShortPassword() {
        UserRegisterRequest shortPasswordRequest = buildUserRegisterRequest("TestUser", "Pa.1", "Pa.1", "00008");
        assertBusinessException(() -> userService.userRegister(shortPasswordRequest), ResultCodeEnum.PARAM_ERROR,
            "登录密码长度不合法（范围 8-20 位）");
    }

    @Test
    @DisplayName("测试注册时密码太长")
    void testUserRegisterWithLongPassword() {
        String pwd = PasswordUtil.generate(MAX_LENGTH);
        UserRegisterRequest longPasswordRequest = buildUserRegisterRequest("testUser", pwd, pwd, "00009");
        assertBusinessException(() -> userService.userRegister(longPasswordRequest), ResultCodeEnum.PARAM_ERROR,
            "登录密码长度不合法（范围 8-20 位）");
    }

    @Test
    @DisplayName("测试注册时密码强度不够")
    void testUserRegisterWithWeakPassword() {
        UserRegisterRequest weakPasswordRequest = buildUserRegisterRequest("testUser", "12345678", "12345678", "00011");
        assertBusinessException(() -> userService.userRegister(weakPasswordRequest), ResultCodeEnum.PARAM_ERROR,
            "登录密码强度不够，必须包含大写字母、小写字母、数字和特殊字符");
    }

    @Test
    @DisplayName("测试注册时密码不匹配")
    void testUserRegisterWithMismatchPassword() {
        UserRegisterRequest mismatchPasswordRequest =
            buildUserRegisterRequest("testUser", "Password..123", "Password..456", "00010");
        assertBusinessException(() -> userService.userRegister(mismatchPasswordRequest), ResultCodeEnum.PARAM_ERROR,
            "登录密码和校验密码不一致");
    }

    @Test
    @DisplayName("测试注册时登录账号已存在")
    void testUserRegisterWithExistingUserAccount() {
        UserRegisterRequest existingUserAccountRequest =
            buildUserRegisterRequest("existingUser", "Password..123", "Password..123", "00012");
        when(mockUserMapper.selectCount(any())).thenReturn(1L);
        BusinessException exception =
            assertThrows(BusinessException.class, () -> userService.userRegister(existingUserAccountRequest));

        assertEquals(ResultCodeEnum.PARAM_ERROR.getCode(), exception.getCode());
        assertEquals("登录账号或星球编号已存在", exception.getMessage());

        verify(userService, never()).save(any(User.class));
    }

    @Test
    @DisplayName("测试注册时星球编号已存在")
    void testUserRegisterWithExistingPlanetCode() {
        UserRegisterRequest existingPlanetCodeRequest =
            buildUserRegisterRequest("newUser", "Password..123", "Password..123", "00001");
        when(mockUserMapper.selectCount(any())).thenReturn(1L);
        BusinessException exception =
            assertThrows(BusinessException.class, () -> userService.userRegister(existingPlanetCodeRequest));

        assertEquals(ResultCodeEnum.PARAM_ERROR.getCode(), exception.getCode());
        assertEquals("登录账号或星球编号已存在", exception.getMessage());

        verify(userService, never()).save(any(User.class));
    }

}
