package com.mlinyun.usercenter.config;

import com.mlinyun.usercenter.mapper.UserMapper;
import com.mlinyun.usercenter.model.entity.User;
import jakarta.annotation.Resource;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * MyBatis-Plus 测试类
 *
 * <p>
 * 该类用于测试 MyBatis-Plus 的相关功能和配置是否正确
 * </p>
 */
@Slf4j
@SpringBootTest
@DisplayName("MyBatis-Plus 操作测试")
class MyBatisPlusOperateTest {

    /**
     * 用户映射器
     */
    @Resource
    private UserMapper userMapper;

    /**
     * 测试查询所有用户
     */
    @Test
    @DisplayName("测试查询所有用户")
    public void testSelectList() {
        // 查询所有用户
        List<User> userList = userMapper.selectList(null);
        // 输出用户数量
        log.info("查询到的用户数量: {}", userList.size());
        // 输出每个用户的信息
        userList.forEach(user -> log.info("用户信息: {}", user));
        if (userList.isEmpty()) {
            log.info("✅ 数据表为空，但 MyBatis-Plus 查询正常！");
        } else {
            log.info("✅ 查询成功，共 {} 条记录。", userList.size());
        }
    }

}
