package com.mlinyun.usercenterback.model.domain.request;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * 用户注册请求体
 *
 * @author LinCanhui
 */
@Data
public class UserRegisterRequest implements Serializable {

    /**
     * 防止序列化过程中冲突
     */
    @Serial
    private static final long serialVersionUID = 1590243006321438588L;

    /**
     * 用户账号
     */
    private String userAccount;

    /**
     * 用户密码
     */
    private String userPassword;

    /**
     * 校验密码
     */
    private String checkPassword;

    /**
     * 用户星球编号
     */
    private String planetCode;

}
