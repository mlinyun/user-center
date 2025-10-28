package com.mlinyun.usercenter.config;

import static org.junit.jupiter.api.Assertions.*;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.SQLException;
import javax.sql.DataSource;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * 数据库连接测试类
 *
 * <p>
 * 该测试类用于验证应用程序是否能够成功连接到配置的数据源（数据库）， 并执行基本的 SQL 查询以确保连接的有效性和数据库的可用性
 * </p>
 */
@Slf4j
@SpringBootTest
@DisplayName("数据库连接测试")
class DatabaseConnectionTest {

    /**
     * 连接有效性检查的超时时间（秒）
     */
    private static final int CONN_TIMEOUT_SEC = 5;
    @Autowired
    private DataSource dataSource;
    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * 测试数据源是否成功注入并可获取连接
     */
    @Test
    @DisplayName("测试数据源连接")
    void testDataSourceConnection() throws SQLException {
        assertNotNull(dataSource, "数据源不应为空");

        try (Connection connection = dataSource.getConnection()) {
            assertNotNull(connection, "连接不应为空");
            assertTrue(connection.isValid(CONN_TIMEOUT_SEC), "连接应该有效");

            // 输出数据库连接信息
            DatabaseMetaData metaData = connection.getMetaData();
            log.info("数据库连接成功!");
            log.info("数据库 URL: {}", metaData.getURL());
            log.info("数据库产品名称: {}", metaData.getDatabaseProductName());
            log.info("数据库产品版本: {}", metaData.getDatabaseProductVersion());
            log.info("数据库驱动名称: {}", metaData.getDriverName());
            log.info("数据库驱动版本: {}", metaData.getDriverVersion());
        }
    }

    /**
     * 测试是否能够执行简单的 SQL 查询
     */
    @Test
    @DisplayName("测试简单 SQL 查询")
    void testSimpleQuery() {
        Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
        assertNotNull(result, "查询结果不应为空");
        assertEquals(1, (int) result, "查询结果应为 1");
        log.info("成功执行 SQL 查询，结果: {}", result);
    }

    /**
     * 测试查询数据库版本信息
     */
    @Test
    @DisplayName("测试数据库版本查询")
    void testDatabaseVersionQuery() {
        String version = jdbcTemplate.queryForObject("SELECT VERSION()", String.class);
        assertNotNull(version, "数据库版本不应为空");
        log.info("MySQL 数据库版本: {}", version);
    }

    /**
     * 测试数据库字符集配置
     */
    @Test
    @DisplayName("测试数据库字符集配置")
    void testDatabaseCharset() {
        String charsetResult = jdbcTemplate.queryForObject("SHOW VARIABLES LIKE 'character_set_database'",
            (rs, rowNum) -> rs.getString("Value"));

        String collationResult = jdbcTemplate.queryForObject("SHOW VARIABLES LIKE 'collation_database'",
            (rs, rowNum) -> rs.getString("Value"));

        log.info("数据库字符集: {}", charsetResult);
        log.info("数据库排序规则: {}", collationResult);

        // 验证是否为 utf8mb4 字符集
        if (charsetResult != null) {
            assertTrue(charsetResult.equals("utf8mb4") || charsetResult.startsWith("utf8"), "数据库应使用 UTF8 字符集");
        }
    }

}
