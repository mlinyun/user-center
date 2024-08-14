package com.mlinyun.usercenterback;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@SpringBootTest
class UserCenterBackApplicationTests {

    @Test
    void contextLoads() {
    }

    // 注入数据源对象
    @Autowired
    private DataSource dataSource;

    @Test
    public void dataSourceTest() throws SQLException {
        // 获取数据源类型
        System.out.println("默认数据源为：" + dataSource.getClass());
        // 获取数据库连接对象
        Connection connection = dataSource.getConnection();
        // 判断连接对象是否为空（若不为空（True）表示数据库连接成功）
        System.out.println(connection != null);
        // 关闭连接对象
        if (connection != null) {
            connection.close();
        }
    }

}
