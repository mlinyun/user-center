package com.mlinyun.usercenter.service;

import org.springframework.web.multipart.MultipartFile;

/**
 * 文件服务接口
 */
public interface FileService {

    /**
     * 上传头像
     *
     * @param file 上传的文件
     * @return 文件访问 URL
     */
    String uploadAvatar(MultipartFile file);

}
