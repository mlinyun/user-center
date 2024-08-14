package com.mlinyun.usercenterback.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.mlinyun.usercenterback.model.domain.User;
import com.mlinyun.usercenterback.service.UserService;
import com.mlinyun.usercenterback.mapper.UserMapper;
import org.springframework.stereotype.Service;

/**
* @author LinCanhui
* @description 针对表【user(用户)】的数据库操作Service实现
* @createDate 2024-08-14 17:32:13
*/
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User>
    implements UserService{

}




