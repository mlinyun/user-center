package com.mlinyun.usercenter.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.mlinyun.usercenter.model.domain.User;
import com.mlinyun.usercenter.service.UserService;
import com.mlinyun.usercenter.mapper.UserMapper;
import org.springframework.stereotype.Service;

/**
 * @author LinCanhui
 * @description 针对表【user(用户)】的数据库操作Service实现
 * @createDate 2024-01-29 22:18:17
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

}




