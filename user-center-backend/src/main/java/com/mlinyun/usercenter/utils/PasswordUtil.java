package com.mlinyun.usercenter.utils;

import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.crypto.digest.BCrypt;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.regex.Pattern;
import lombok.extern.slf4j.Slf4j;

/**
 * 密码工具类
 *
 * <p>
 * 基于 Hutool BCrypt 算法实现的密码加密和验证工具
 *
 * <p>
 * 主要功能：
 * <ul>
 * <li>密码加密：使用 BCrypt 算法，自动生成随机盐值</li>
 * <li>密码验证：验证原始密码与加密密码是否匹配</li>
 * <li>密码强度校验：支持多种强度规则验证</li>
 * <li>密码生成：生成符合规则的随机密码</li>
 * </ul>
 *
 * <p>
 * BCrypt 特点：
 * <ul>
 * <li>自适应哈希算法，可配置计算强度</li>
 * <li>每次加密自动生成随机盐值，同一密码每次加密结果不同</li>
 * <li>加密结果固定60个字符，包含算法版本、强度、盐值和哈希值</li>
 * <li>抗暴力破解，随着硬件性能提升可调整强度</li>
 * </ul>
 *
 * @author mlinyun
 * @since 2025-10-20
 */
@Slf4j
public final class PasswordUtil {

    /**
     * BCrypt 加密强度（工作因子）
     *
     * <p>
     * 取值范围：4-31，推荐值：10-12
     * <ul>
     * <li>10：约70ms，适合大部分场景（默认）</li>
     * <li>12：约280ms，高安全场景</li>
     * <li>14：约1.1s，极高安全场景（如金融系统）</li>
     * </ul>
     *
     * <p>
     * 注意：强度每增加1，计算时间翻倍（2^n 次迭代）
     */
    private static final int DEFAULT_BCRYPT_STRENGTH = 10;

    /**
     * 密码强度最小范围
     */
    private static final int PASSWORD_STRONG_MIN = 4;

    /**
     * 密码强度最大范围
     */
    private static final int PASSWORD_STRONG_MAX = 31;

    /**
     * 密码最小长度
     */
    private static final int PASSWORD_MIN_LENGTH = 8;

    /**
     * 密码最大长度
     */
    private static final int PASSWORD_MAX_LENGTH = 20;

    /**
     * 密码默认长度
     */
    private static final int DEFAULT_PASSWORD_LENGTH = 16;

    /**
     * 密码强度等级常量：弱 - 0
     */
    public static final int STRENGTH_WEAK = 0;

    /**
     * 密码强度等级常量：中 - 1
     */
    public static final int STRENGTH_MEDIUM = 1;

    /**
     * 密码强度等级常量：强 - 2
     */
    public static final int STRENGTH_STRONG = 2;

    /**
     * 大写字母字符集
     */
    private static final String UPPER_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    /**
     * 小写字母字符集
     */
    private static final String LOWER_CHARS = "abcdefghijklmnopqrstuvwxyz";

    /**
     * 数字字符集
     */
    private static final String DIGIT_CHARS = "0123456789";

    /**
     * 可用的特殊字符（英文键盘常见可输入字符）
     */
    private static final String SPECIAL_CHARS = "~`!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?";

    /**
     * 密码中等强度正则： 要求：至少包含字母和数字，可选特殊字符
     */
    private static final Pattern PATTERN_MEDIUM =
        Pattern.compile("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d~`!@#$%^&*()\\-_=+\\[{\\]}\\\\|;:'\",<.>/?]{"
            + PASSWORD_MIN_LENGTH + "," + PASSWORD_MAX_LENGTH + "}$");

    /**
     * 密码最强强度正则： 要求：必须包含至少一个小写字母，必须包含至少一个大写字母，必须包含至少一个数字，必须包含至少一个特殊字符
     */
    private static final Pattern PATTERN_STRONG =
        Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[~`!@#$%^&*()\\-_=+\\[{\\]}\\\\|;:'\",<.>/?])"
            + "[A-Za-z\\d~`!@#$%^&*()\\-_=+\\[{\\]}\\\\|;:'\",<.>/?]{" + PASSWORD_MIN_LENGTH + "," + PASSWORD_MAX_LENGTH
            + "}$");

    /**
     * 安全随机数生成器（线程安全）
     */
    private static final SecureRandom RANDOM = new SecureRandom();

    /**
     * 私有构造函数，防止实例化
     */
    private PasswordUtil() {
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }

    /**
     * 加密密码（使用默认强度）
     *
     * <p>
     * 使用 BCrypt 算法对密码进行加密，自动生成随机盐值
     *
     * @param rawPassword 原始密码
     * @return 加密后的密码（60个字符，格式：$2a$10$salt+hash）
     * @throws IllegalArgumentException 如果原始密码为空
     */
    public static String encrypt(String rawPassword) {
        return encrypt(rawPassword, DEFAULT_BCRYPT_STRENGTH);
    }

    /**
     * 加密密码（指定强度）
     *
     * @param rawPassword 原始密码
     * @param strength 加密强度（4-31，推荐10-12）
     * @return 加密后的密码
     * @throws IllegalArgumentException 如果原始密码为空或强度不合法
     */
    public static String encrypt(String rawPassword, int strength) {
        // 参数校验
        if (CharSequenceUtil.isBlank(rawPassword)) {
            throw new IllegalArgumentException("原始密码不能为空");
        }
        if (strength < PASSWORD_STRONG_MIN || strength > PASSWORD_STRONG_MAX) {
            log.warn("BCrypt 强度超出推荐范围(4-31)，使用默认强度: {}", DEFAULT_BCRYPT_STRENGTH);
            strength = DEFAULT_BCRYPT_STRENGTH;
        }

        try {
            // 生成盐值并加密
            String salt = BCrypt.gensalt(strength);
            String encrypted = BCrypt.hashpw(rawPassword, salt);
            log.debug("密码加密成功，强度: {}", strength);
            return encrypted;
        } catch (Exception e) {
            log.error("密码加密失败", e);
            throw new RuntimeException("密码加密失败", e);
        }
    }

    /**
     * 验证密码是否匹配
     *
     * <p>
     * 用于用户登录时验证输入的密码是否与数据库中存储的加密密码匹配
     *
     * @param rawPassword 用户输入的原始密码
     * @param hashedPassword 数据库中存储的加密密码
     * @return true-密码匹配，false-密码不匹配
     * @throws IllegalArgumentException 如果任一参数为空
     */
    public static boolean verify(String rawPassword, String hashedPassword) {
        // 参数校验
        if (CharSequenceUtil.isBlank(rawPassword)) {
            log.warn("验证失败：原始密码为空");
            return false;
        }
        if (CharSequenceUtil.isBlank(hashedPassword)) {
            log.warn("验证失败：加密密码为空");
            return false;
        }

        try {
            // BCrypt.checkpw 会自动从 hashedPassword 中提取盐值进行验证
            boolean isMatch = BCrypt.checkpw(rawPassword, hashedPassword);
            log.debug("密码验证结果: {}", isMatch);
            return isMatch;
        } catch (Exception e) {
            log.error("密码验证异常", e);
            return false;
        }
    }

    /**
     * 校验密码强度（基础级别）
     *
     * <p>
     * 要求：长度 8-20 位
     * </p>
     *
     * @param password 待校验的密码
     * @return true-符合要求，false-不符合要求
     */
    public static boolean isValidBasic(String password) {
        if (CharSequenceUtil.isBlank(password)) {
            return false;
        }
        return password.length() >= PASSWORD_MIN_LENGTH && password.length() <= PASSWORD_MAX_LENGTH;
    }

    /**
     * 校验密码强度（中等级别）
     *
     * <p>
     * 要求：
     * <ul>
     * <li>长度 8-20 位</li>
     * <li>至少包含字母和数字</li>
     * <li>可选特殊字符：~`!@#$%^&*()-_=+[{]}\|;:'",<.>/?</li>
     * </ul>
     *
     * @param password 待校验的密码
     * @return true-符合要求，false-不符合要求
     */
    public static boolean isValidMedium(String password) {
        if (CharSequenceUtil.isBlank(password)) {
            return false;
        }
        return PATTERN_MEDIUM.matcher(password).matches();
    }

    /**
     * 校验密码强度（强级别）
     *
     * <p>
     * 要求：
     * <ul>
     * <li>长度 8-20 位</li>
     * <li>必须包含小写字母</li>
     * <li>必须包含大写字母</li>
     * <li>必须包含数字</li>
     * <li>必须包含特殊字符：~`!@#$%^&*()-_=+[{]}\|;:'",<.>/?</li>
     * </ul>
     *
     * @param password 待校验的密码
     * @return true-符合要求，false-不符合要求
     */
    public static boolean isValidStrong(String password) {
        if (CharSequenceUtil.isBlank(password)) {
            return false;
        }
        return PATTERN_STRONG.matcher(password).matches();
    }

    /**
     * 检查密码是否包含常见弱密码
     *
     * <p>
     * 常见弱密码示例：
     * <ul>
     * <li>连续数字：123456, 111111</li>
     * <li>键盘顺序：qwerty, asdfgh</li>
     * <li>常见单词：password, admin</li>
     * </ul>
     *
     * @param password 待检查的密码
     * @return true-是弱密码，false-不是弱密码
     */
    public static boolean isWeakPassword(String password) {
        if (CharSequenceUtil.isBlank(password)) {
            return true;
        }

        // 常见弱密码列表
        String[] weakPasswords =
            {"123456", "123456789", "111111", "000000", "password", "12345678", "qwerty", "abc123", "admin", "admin123",
                "root", "123123", "654321", "666666", "888888", "qwerty123", "1qaz2wsx", "asdfgh", "zxcvbn"};

        String lowerPassword = password.toLowerCase();
        for (String weak : weakPasswords) {
            if (lowerPassword.contains(weak)) {
                log.warn("检测到弱密码特征: {}", weak);
                return true;
            }
        }

        // 检查连续字符（如 aaa, 111）
        if (password.matches(".*(\\w)\\1{2,}.*")) {
            log.warn("检测到连续重复字符");
            return true;
        }

        return false;
    }

    /**
     * 生成随机强密码
     *
     * <p>
     * 生成规则：
     * <ul>
     * <li>长度为指定值</li>
     * <li>包含大写字母、小写字母、数字和特殊字符</li>
     * <li>各类字符随机分布</li>
     * </ul>
     *
     * @param length 密码长度（最小8位）
     * @return 生成的随机密码
     * @throws IllegalArgumentException 如果长度小于8
     */
    public static String generate(int length) {
        if (length < PASSWORD_MIN_LENGTH) {
            throw new IllegalArgumentException("密码长度不能小于 " + PASSWORD_MIN_LENGTH);
        }

        // 存储各类字符的集合
        List<Character> chars = new ArrayList<Character>(length);

        // 确保每类字符至少出现一次
        chars.add(randomChar(UPPER_CHARS));
        chars.add(randomChar(LOWER_CHARS));
        chars.add(randomChar(DIGIT_CHARS));
        chars.add(randomChar(SPECIAL_CHARS));

        // 剩余长度随机选择字符
        String allChars = UPPER_CHARS + LOWER_CHARS + DIGIT_CHARS + SPECIAL_CHARS;
        for (int i = chars.size(); i < length; i++) {
            chars.add(randomChar(allChars));
        }

        // Fisher-Yates 洗牌算法打乱字符顺序（安全随机）
        Collections.shuffle(chars, RANDOM);

        // 构建最终密码字符串
        StringBuilder strongPassword = new StringBuilder(length);
        for (char c : chars) {
            strongPassword.append(c);
        }

        // 返回生成的强密码
        return strongPassword.toString();
    }

    /**
     * 生成默认长度（16位）的随机强密码
     *
     * @return 生成的随机密码
     */
    public static String generate() {
        return generate(DEFAULT_PASSWORD_LENGTH);
    }

    /**
     * 从指定字符池中随机选择一个字符
     *
     * @param pool 字符池
     * @return 随机选择的字符
     */
    private static char randomChar(String pool) {
        return pool.charAt(RANDOM.nextInt(pool.length()));
    }

    /**
     * 获取密码强度等级
     *
     * @param password 待评估的密码
     * @return 强度等级：0-弱，1-中，2-强
     */
    public static int getStrengthLevel(String password) {
        if (isWeakPassword(password) || !isValidBasic(password)) {
            return STRENGTH_WEAK; // 弱
        }
        if (isValidStrong(password)) {
            return STRENGTH_STRONG; // 强
        }
        if (isValidMedium(password)) {
            return STRENGTH_MEDIUM; // 中
        }
        return STRENGTH_WEAK; // 弱
    }

    /**
     * 获取密码强度描述
     *
     * @param password 待评估的密码
     * @return 强度描述：弱、中等、强
     */
    public static String getStrengthDescription(String password) {
        int level = getStrengthLevel(password);
        return switch (level) {
            case STRENGTH_STRONG -> "强";
            case STRENGTH_MEDIUM -> "中等";
            default -> "弱";
        };
    }
}
