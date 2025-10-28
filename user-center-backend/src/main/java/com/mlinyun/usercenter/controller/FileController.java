package com.mlinyun.usercenter.controller;

import cn.hutool.core.util.ObjectUtil;
import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.mlinyun.usercenter.common.BaseResponse;
import com.mlinyun.usercenter.common.ResultCodeEnum;
import com.mlinyun.usercenter.common.ResultUtils;
import com.mlinyun.usercenter.exception.ThrowUtils;
import com.mlinyun.usercenter.service.FileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * 文件上传控制器
 *
 * <p>
 * 该类用于处理文件上传和访问的相关请求
 * </p>
 */
@Slf4j
@RestController
@RequestMapping("/file")
@Tag(name = "FileController", description = "文件上传相关接口")
public class FileController {

    /**
     * 文件服务
     */
    @Resource
    private FileService fileService;

    /**
     * 上传头像
     *
     * @param file 上传的文件
     * @return 文件访问 URL
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/upload/avatar")
    @Operation(summary = "上传头像", description = "上传用户头像文件")
    public BaseResponse<String> uploadAvatar(@RequestParam("file") MultipartFile file) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(file), ResultCodeEnum.PARAM_ERROR, "文件不能为空");
        ThrowUtils.throwIf(file.isEmpty(), ResultCodeEnum.PARAM_ERROR, "文件内容为空");
        String fileUrl = fileService.uploadAvatar(file);
        return ResultUtils.success(fileUrl);
    }

}
