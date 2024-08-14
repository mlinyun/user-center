package com.mlinyun.usercenterback.service;

import com.mlinyun.usercenterback.model.domain.User;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * 用户服务测试
 *
 * @author LinCanhui
 */
@SpringBootTest
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Test
    public void testAddUser() {
        User user = new User();
        user.setUsername("testUser");
        user.setUserAccount("123456");
        user.setAvatarUrl("https://www.baidu.com/img/flexible/logo/pc/result.png");
        user.setGender(0);
        user.setUserPassword("123456");
        user.setPhone("15600000000");
        user.setEmail("123@qq.com");
        user.setPlanetCode("3");
        boolean result = userService.save(user);
        System.out.println(user.getId());
        Assertions.assertTrue(result);
    }

}