package com.mlinyun.usercenter.utils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

/**
 * 密码工具类单元测试
 */
@Slf4j
@DisplayName("PasswordUtil 密码工具类测试")
class PasswordUtilTest {

    /**
     * BCrypt 加密后字符串长度
     */
    private static final int BCRYPT_HASH_LENGTH = 60;

    /**
     * BCrypt 强度参数 10
     */
    private static final int STRENGTH_10 = 10;

    /**
     * BCrypt 强度参数 12
     */
    private static final int STRENGTH_12 = 12;

    /**
     * 有效密码位数：20 [8-20]
     */
    private static final int VALID_PASSWORD_DIGITS = 20;

    /**
     * 无效密码位数：21 (少于8或多于20）
     */
    private static final int INVALID_PASSWORD_DIGITS21 = 21;

    /**
     * 无效密码位数：7 (少于8或多于20）
     */
    private static final int INVALID_PASSWORD_DIGITS7 = 7;

    /**
     * 默认生成密码长度：16
     */
    private static final int DEFAULT_GENERATE_LENGTH = 16;

    /**
     * 密码强度等级：0 - 弱
     */
    private static final int STRENGTH_LEVEL_WEAK = 0;

    /**
     * 密码强度等级：1 - 中等
     */
    private static final int STRENGTH_LEVEL_MEDIUM = 1;

    /**
     * 密码强度等级：2 - 强
     */
    private static final int STRENGTH_LEVEL_STRONG = 2;

    @Test
    @DisplayName("应该能够加密密码并生成60字符的BCrypt哈希值")
    void testEncryptPasswordReturnValidBcryptHash() {
        String rawPassword = "Password@123";
        String encryptedPassword = PasswordUtil.encrypt(rawPassword);

        assertThat(encryptedPassword).isNotNull().isNotEmpty().isNotEqualTo(rawPassword);
        assertThat(encryptedPassword).hasSize(BCRYPT_HASH_LENGTH);
        assertThat(encryptedPassword).startsWith("$2a$");
    }

    @Test
    @DisplayName("指定强度参数的密码加密应该体现在结果中")
    void testEncryptWithStrengthParameter() {
        String rawPassword = "Test@123456";
        String encrypted10 = PasswordUtil.encrypt(rawPassword, STRENGTH_10);
        String encrypted12 = PasswordUtil.encrypt(rawPassword, STRENGTH_12);

        assertThat(encrypted10).contains("$10$");
        assertThat(encrypted12).contains("$12$");
    }

    @Test
    @DisplayName("空密码或null应该抛出异常")
    void testEncryptEmptyPasswordThrowsException() {
        assertThrows(IllegalArgumentException.class, () -> PasswordUtil.encrypt(""));
        assertThrows(IllegalArgumentException.class, () -> PasswordUtil.encrypt(null));
    }

    @Test
    @DisplayName("使用正确的原始密码验证应该返回true")
    void testVerifyPasswordWithCorrectPassword() {
        String rawPassword = "Password@123";
        String encryptedPassword = PasswordUtil.encrypt(rawPassword);
        boolean isMatch = PasswordUtil.verify(rawPassword, encryptedPassword);

        assertThat(isMatch).isTrue();
    }

    @Test
    @DisplayName("使用错误的密码验证应该返回false")
    void testVerifyPasswordWithWrongPassword() {
        String originalPassword = "Password@123";
        String wrongPassword = "WrongPassword@123";
        String encryptedPassword = PasswordUtil.encrypt(originalPassword);
        boolean isMatch = PasswordUtil.verify(wrongPassword, encryptedPassword);

        assertThat(isMatch).isFalse();
    }

    @Test
    @DisplayName("密码验证应该处理空参数（null和空字符串）")
    void testVerifyPasswordEdgeCases() {
        String encrypted = PasswordUtil.encrypt("Test@123456");

        assertThat(PasswordUtil.verify("", encrypted)).isFalse();
        assertThat(PasswordUtil.verify("Test@123456", "")).isFalse();
        assertThat(PasswordUtil.verify("Test@123456", encrypted)).isTrue();
    }

    @Test
    @DisplayName("密码加密应该稳定工作不抛出异常")
    void testEncryptPasswordNoException() {
        String[] passwords = {"Password@123", "StrongPass@456", "SecurePassword@789", "ComplexPass@000"};

        for (String password : passwords) {
            assertDoesNotThrow(() -> PasswordUtil.encrypt(password));
        }
    }

    @Test
    @DisplayName("应该正确验证密码基础长度要求（8-20位）")
    void testIsValidBasicLength() {
        assertThat(PasswordUtil.isValidBasic("12345678")).isTrue();
        assertThat(PasswordUtil.isValidBasic("a".repeat(VALID_PASSWORD_DIGITS))).isTrue();
        assertThat(PasswordUtil.isValidBasic("1234567")).isFalse();
        assertThat(PasswordUtil.isValidBasic("a".repeat(INVALID_PASSWORD_DIGITS21))).isFalse();
        assertThat(PasswordUtil.isValidBasic("")).isFalse();
    }

    @ParameterizedTest
    @ValueSource(strings = {"Abc12345", "Test@123", "MyPassword2024", "user123pass"})
    @DisplayName("有效的中等强度密码应该验证通过")
    void testValidMediumPasswords(String password) {
        assertThat(PasswordUtil.isValidMedium(password)).isTrue();
    }

    @ParameterizedTest
    @ValueSource(strings = {"12345678", "abcdefgh", "@@@@@@@@", "Abc123", ""})
    @DisplayName("无效的中等强度密码应该验证失败")
    void testInvalidMediumPasswords(String password) {
        assertThat(PasswordUtil.isValidMedium(password)).isFalse();
    }

    @ParameterizedTest
    @ValueSource(strings = {"Test@123456", "MyPass#2024", "Secure$Pass1"})
    @DisplayName("有效的强密码应该验证通过")
    void testValidStrongPasswords(String password) {
        assertThat(PasswordUtil.isValidStrong(password)).isTrue();
    }

    @ParameterizedTest
    @ValueSource(strings = {"test@123456", "TEST@123456", "Test123456", "Test@abcdef"})
    @DisplayName("无效的强密码（缺少必要字符类）应该验证失败")
    void testInvalidStrongPasswords(String password) {
        assertThat(PasswordUtil.isValidStrong(password)).isFalse();
    }

    @ParameterizedTest
    @ValueSource(strings = {"123456", "password", "admin123", "qwerty123", "111111", "aaa123456"})
    @DisplayName("简单密码应该被识别为弱密码")
    void testSimplePasswordsAsWeak(String password) {
        assertThat(PasswordUtil.isWeakPassword(password)).isTrue();
    }

    @Test
    @DisplayName("生成默认长度密码应该符合强度要求")
    void testGenerateDefaultLength() {
        String password = PasswordUtil.generate();

        assertThat(password).isNotNull().hasSize(DEFAULT_GENERATE_LENGTH);
        assertThat(PasswordUtil.isValidStrong(password)).isTrue();
    }

    @Test
    @DisplayName("生成指定长度密码应该符合要求且结果不同")
    void testGenerateWithLength() {
        String password1 = PasswordUtil.generate(VALID_PASSWORD_DIGITS);
        String password2 = PasswordUtil.generate(VALID_PASSWORD_DIGITS);

        assertThat(password1).hasSize(VALID_PASSWORD_DIGITS);
        assertThat(PasswordUtil.isValidStrong(password1)).isTrue();
        assertThat(password1).isNotEqualTo(password2);
    }

    @Test
    @DisplayName("生成长度不足的密码应该抛出异常")
    void testGenerateWithInvalidLength() {
        assertThrows(IllegalArgumentException.class, () -> {
            PasswordUtil.generate(INVALID_PASSWORD_DIGITS7);
        });
    }

    @Test
    @DisplayName("应该正确评估密码强度等级")
    void testGetStrengthLevel() {
        assertThat(PasswordUtil.getStrengthLevel("123456")).isEqualTo(STRENGTH_LEVEL_WEAK);
        assertThat(PasswordUtil.getStrengthLevel("abc123")).isEqualTo(STRENGTH_LEVEL_WEAK);
        assertThat(PasswordUtil.getStrengthLevel("Abc5793r")).isEqualTo(STRENGTH_LEVEL_MEDIUM);
        assertThat(PasswordUtil.getStrengthLevel("4:p*b5eW;llG")).isEqualTo(STRENGTH_LEVEL_STRONG);
    }

    @Test
    @DisplayName("应该返回密码强度的文本描述")
    void testGetStrengthDescription() {
        assertThat(PasswordUtil.getStrengthDescription("123456")).isEqualTo("弱");
        assertThat(PasswordUtil.getStrengthDescription("Abc5793r")).isEqualTo("中等");
        assertThat(PasswordUtil.getStrengthDescription("4:p*b5eW;llG")).isEqualTo("强");
    }

    @Test
    @DisplayName("更高BCrypt强度的加密应该耗时更长")
    void testEncryptPerformance() {
        String password = "Test@123456";

        long start10 = System.currentTimeMillis();
        PasswordUtil.encrypt(password, STRENGTH_10);
        long time10 = System.currentTimeMillis() - start10;

        long start12 = System.currentTimeMillis();
        PasswordUtil.encrypt(password, STRENGTH_12);
        long time12 = System.currentTimeMillis() - start12;

        log.info("强度10加密耗时: {}ms", time10);
        log.info("强度12加密耗时: {}ms", time12);

        assertThat(time12).isGreaterThanOrEqualTo(time10);
    }

    @Test
    @DisplayName("完整的用户注册和登录场景")
    void testUserRegistrationScenario() {
        String userInputPassword = "MySecure@Pass2024";

        assertThat(PasswordUtil.isValidStrong(userInputPassword)).isTrue();
        assertThat(PasswordUtil.isWeakPassword(userInputPassword)).isFalse();

        String encryptedPassword = PasswordUtil.encrypt(userInputPassword);
        assertThat(encryptedPassword).isNotNull();

        String loginInput = "MySecure@Pass2024";
        assertThat(PasswordUtil.verify(loginInput, encryptedPassword)).isTrue();

        String wrongInput = "WrongPassword123";
        assertThat(PasswordUtil.verify(wrongInput, encryptedPassword)).isFalse();
    }
}
