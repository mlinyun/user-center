package com.mlinyun.usercenter.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfiguration {
    // 扫描路径
    private static final String basePackage = "com.mlinyun.usercenter.controller";

    @Bean
    public GroupedOpenApi group01() {
        return GroupedOpenApi.builder()
                .group("凌云用户中心接口")
                .packagesToScan(basePackage)
                .build();
    }

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(apiInfo())
                .externalDocs(externalDocumentation());
    }

    /**
     * 创建该 API 的基本信息（这些基本信息会展现在文档页面中）
     */
    private Info apiInfo() {
        Contact contact = new Contact();
        contact.setEmail("1938985998@qq.com");
        contact.setName("mlinyun");
        contact.setUrl("https://github.com/mlinyun");
        return new Info()
                .title("凌云用户中心系统API文档")
                .description("企业核心的用户中心系统，基于 Spring Boot 后端 + React 前端的 **全栈项目**，实现了用户注册、登录、查询等基础功能。")
                .version("v1.0.0")
                .contact(contact)
                .license(new License().name("Apache 2.0").url("https://github.com/mlinyun"));
    }

    private ExternalDocumentation externalDocumentation() {
        return new ExternalDocumentation()
                .description("项目 GitHub 地址")
                .url("https://github.com/mlinyun/user-center");
    }
}
