package com.mlinyun.usercenterback;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@MapperScan("com.mlinyun.usercenterback.mapper")
@SpringBootApplication
public class UserCenterBackApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserCenterBackApplication.class, args);
    }

}
