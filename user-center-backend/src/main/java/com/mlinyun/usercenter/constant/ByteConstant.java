package com.mlinyun.usercenter.constant;

public final class ByteConstant {

    /**
     * 私有构造函数，防止实例化
     */
    private ByteConstant() {
        // 私有化构造函数，防止实例化
        throw new IllegalStateException("Utility class");
    }

    /**
     * 每 KB 的字节数
     */
    public static final int BYTES_PER_KB = 1024;

    /**
     * 每 MB 的字节数
     */
    public static final int BYTES_PER_MB = BYTES_PER_KB * BYTES_PER_KB;

    /**
     * 上传文件默认最大大小，单位为字节，默认 2MB
     */
    public static final long DEFAULT_MAX_FILE_SIZE = 2L * BYTES_PER_MB;

}
