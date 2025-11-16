<div align="center">

<img src="https://notebook.mlinyun.com/user-center/logo.svg" alt="凌云用户中心系统" width="100" height="100">

# 凌云用户中心系统

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Vue](https://img.shields.io/badge/Vue-3.5-green.svg)](https://vuejs.org/)
[![Ant Design Pro](https://img.shields.io/badge/Ant%20Design%20Pro-6.0.0-1890FF.svg)](https://pro.ant.design/)
[![Ant Design Pro Vue](https://img.shields.io/badge/Ant%20Design%20Vue-4.2.6-0960BD.svg)](https://antdv.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**一个功能完整的企业级用户管理系统**

[在线预览 (React 版)](https://react.uc.mlinyun.com) | [在线预览 (Vue 版)](https://vue.uc.mlinyun.com) | [快速开始](#-快速开始)

</div>

---

## 📖 项目简介

凌云用户中心是一个企业级的用户管理系统，就像您在使用各种网站和 APP 时看到的登录、注册、个人资料管理功能一样。这个系统可以帮助个人开发者或团队快速搭建一套完整的用户管理解决方案。

> 本项目是我在学习 [鱼皮的编程导航](https://www.codefather.cn/)
> 用户中心系统课程后的实践成果。通过这个项目，我系统地掌握了从需求分析、技术选型到开发部署的完整流程。如果你也想通过实战项目提升编程能力，和其他编程爱好者一起交流进步，非常推荐加入：
**[👉 点击加入编程导航，一起学习成长](https://www.codefather.cn/vip?shareCode=fve9bb)**

### 💡 为什么选择这个项目？

- **从 0 到 1 的完整体验**：涵盖需求分析、技术选型、开发、测试到部署的全流程
- **双前端实现**：同时提供 React 和 Vue 两套前端方案，满足不同技术栈学习需求
- **生产级代码规范**：遵循企业级开发标准，包含完整的代码规范、API 文档和单元测试
- **技术栈主流且实用**：使用 Spring Boot 3、React 18、Vue 3 等最新稳定版本
- **专注核心能力**：功能设计精简聚焦，让你把精力放在**学习技术和积累经验**上，而非复杂的业务逻辑

---

## ✨ 功能介绍

### 用户端功能

| 功能           | 描述                         |
|--------------|----------------------------|
| 👤 **用户注册**  | 通过用户名和密码创建账号，系统会检查密码强度确保安全 |
| 🔐 **用户登录**  | 输入账号密码登录，登录后可以自动保持登录状态     |
| 📝 **个人资料**  | 查看和编辑个人信息，包括昵称、头像、邮箱、手机号等  |
| 🖼️ **头像上传** | 支持上传个性化头像，让您的账号更有辨识度       |
| 🔒 **账户安全**  | 修改登录密码，密码使用高强度加密算法保护       |
| 👋 **退出登录**  | 安全退出当前登录状态                 |

### 管理端功能

| 功能             | 描述                       |
|----------------|--------------------------|
| 👨‍💼 **用户管理** | 管理员可以查看所有用户，支持搜索、分页浏览    |
| ➕ **添加用户**     | 管理员可以手动添加新用户             |
| ✏️ **编辑用户**    | 修改用户信息，如角色、状态等           |
| 🗑️ **删除用户**   | 删除不再需要的用户账号              |
| 🚫 **账户封禁**    | 封禁违规用户，防止其继续使用系统         |
| ✅ **解除封禁**     | 解除对用户的封禁，恢复正常使用          |
| 🎭 **权限控制**    | 精细化的权限管理，确保只有授权人员能访问敏感功能 |

---

## 🎨 界面预览

### 在线体验

- **React 版本**：https://react.uc.mlinyun.com
- **Vue 版本**：https://vue.uc.mlinyun.com

> 💡 体验提示：使用管理员账号（账号：`Admin01` 密码：`Admin..1024`）登录可体验完整的管理功能
>

### 注册页面

简洁的注册界面，只需填写必要信息即可快速创建账号。

![注册页面](https://notebook.mlinyun.com/user-center/register.png)

### 登录页面

通过账号 + 密码的方式进行登录

![登录页面](https://notebook.mlinyun.com/user-center/login.png)

### 欢迎页面

登录后的首页，展示用户信息、项目核心功能特性和使用的技术栈

![欢迎页面](https://notebook.mlinyun.com/user-center/welcome.png)

### 个人资料页面

该页面可以查看用户个人的详细信息

![个人资料页面](https://notebook.mlinyun.com/user-center/profile.png)

### 账号设置页面

用于修改个人基本信息、修改密码等账号安全设置

![账号设置页面](https://notebook.mlinyun.com/user-center/settings.png)

### 用户管理页面

管理员专用，可以管理所有用户

![用户管理页面](https://notebook.mlinyun.com/user-center/user-manage.png)

## 🏗️ 技术架构

### 系统架构图

<img src="https://notebook.mlinyun.com/user-center/system_architecture.svg" alt="凌云用户中心系统架构图">

### 后端技术栈

| 技术           | 版本      | 说明                 |
|--------------|---------|--------------------|
| Spring Boot  | 3.5.6   | 核心框架，提供自动配置和快速开发能力 |
| MyBatis-Plus | 3.5.14  | ORM 框架，简化数据库操作     |
| MySQL        | 8.0+    | 关系型数据库             |
| Knife4j      | 4.5.0   | API 文档增强工具，提供在线调试  |
| Hutool       | 5.8.41  | Java 工具库，简化开发      |
| Lombok       | 1.18.40 | 减少样板代码             |

**核心特性：**

- ✅ **会话认证机制**：基于 HttpSession 的轻量级认证，无需额外 Token 管理
- ✅ **AOP 权限控制**：通过注解实现优雅的权限校验
- ✅ **RESTful API 设计**：统一的响应格式和错误处理
- ✅ **在线 API 文档**：Knife4j 提供美观的接口文档和在线测试

### 前端技术栈

#### React 版本

| 技术          | 版本   | 说明         |
|-------------|------|------------|
| React       | 18.2 | 声明式 UI 框架  |
| Umi Max     | 4.x  | 企业级前端应用框架  |
| Ant Design  | 5.x  | 企业级 UI 组件库 |
| Umi Request | -    | 网络请求库      |

#### Vue 版本

| 技术             | 版本     | 说明           |
|----------------|--------|--------------|
| Vue            | 3.5    | 渐进式前端框架      |
| Vite           | -      | 下一代前端构建工具    |
| Pinia          | 3.0.3  | Vue 官方状态管理库  |
| Ant Design Vue | 4.2.6  | Vue 版 UI 组件库 |
| Axios          | 1.13.1 | HTTP 请求库     |

**前端特色：**

- 🎯 **双技术栈支持**：React 和 Vue 两套完整实现，便于学习和对比
- 🎨 **统一 UI 风格**：都采用 Ant Design UI 组件库，界面美观一致
- 🚀 **现代化构建**：React 使用 Umi，Vue 使用 Vite，开发体验极佳
- 📦 **状态管理**：React 使用 Umi Model，Vue 使用 Pinia

---

## 🔐 安全特性

### 密码安全

- 注册时检查密码强度，确保密码足够复杂
- 使用 BCrypt 算法加密存储，即使数据库泄露也无法还原原始密码
- 支持随时修改密码，保护账户安全

### 权限控制

- **角色区分**：系统分为普通用户和管理员两种角色
- **权限隔离**：普通用户只能管理自己的信息，管理员才能管理所有用户
- **接口保护**：敏感操作需要验证身份和权限，防止越权访问

### 会话管理

- 登录后自动维持登录状态，无需频繁输入密码
- 支持"记住我"功能，提升使用便利性
- 安全退出机制，及时清理会话信息

---

## 🚀 快速开始

### 环境要求

- **后端**：JDK 17+、Maven 3.9+、MySQL 8.0+
- **前端**：Node.js 18+（Vue 需要 20+）、pnpm

### 1. 克隆项目

```bash
git clone https://github.com/mlinyun/user-center.git
cd user-center
```

### 2. 数据库配置

```bash
# 创建数据库
mysql -u root -p < sql/user-center-schema.sql

# 导入表结构
mysql -u root -p < sql/user-center-table.sql

# 导入测试数据（可选）
mysql -u root -p < sql/user-center-data.sql
```

### 3. 启动后端

```bash
cd user-center-backend

# 修改 application-dev.yml 中的数据库配置
# spring.datasource.username 和 password

# 安装依赖并启动
mvn clean install
mvn spring-boot:run
```

后端服务将在 `http://localhost:8100` 启动

### 4. 启动前端

#### React 版本

```bash
cd user-center-react-frontend
pnpm install
pnpm start
```

访问：`http://localhost:8000`

#### Vue 版本

```bash
cd user-center-vue-frontend
pnpm install
pnpm dev
```

访问：`http://localhost:8082`

### 5. 访问系统

- **前端页面**：根据启动的版本访问对应端口
- **API 文档**：
    - Swagger UI: `http://localhost:8100/api/swagger-ui.html`
    - Knife4j: `http://localhost:8100/api/doc.html` (用户名/密码: admin/admin123)

---

## 🔧 核心功能实现

### 1. 权限控制

通过 AOP + 自定义注解实现优雅的权限校验：

```java

@ApiOperationSupport(author = "LingYun")
@PostMapping("/addUser")
@AuthCheck(mustRole = UserConstant.ADMIN_USER_ROLE)
@Operation(summary = "管理员添加用户", description = "管理员添加用户接口")
public BaseResponse<Long> adminAddUser(@RequestBody @Valid AdminAddUserRequest adminAddUserRequest) {
    // 只有管理员角色才能访问此接口
}
```

### 2. 会话认证

登录成功后将用户信息存储到 HttpSession：

```java

@Override
public UserLoginVO userLogin(UserLoginRequest userLoginRequest, HttpServletRequest request) {
    // ... 登录逻辑省略
    // 记录用户登录状态
    request.getSession().setAttribute(UserConstant.USER_LOGIN_STATE, loginUser);
}
```

### 3. 密码加密

使用 BCrypt 算法加密密码：

```java
String encryptPassword = BCrypt.hashpw(userPassword, BCrypt.gensalt());
```

### 4. 统一响应格式

```json
{
  "success": true,
  "code": 20000,
  "message": "成功",
  "data": {}
}
```

---

## 🌐 生产部署

### 后端部署

```bash
# 打包
mvn clean package

# 设置环境变量
export DB_USER_CENTER_USERNAME=your_username
export DB_USER_CENTER_PASSWORD=your_password

# 运行
java -jar target/user-center-backend-*.jar --spring.profiles.active=prod
```

### 前端部署

```bash
# React 版本
cd user-center-react-frontend
pnpm build
# 将 dist 目录部署到 Nginx

# Vue 版本
cd user-center-vue-frontend
pnpm build
# 将 dist 目录部署到 Nginx
```

### Nginx 配置示例

```nginx
upstream user_center_backend {
    server 127.0.0.1:8100;
}

server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /var/www/user-center/dist;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API 代理
    location /api {
        proxy_pass http://user_center_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 📚 开发文档

### 在线文档

- 项目文档地址：https://docs.uc.mlinyun.com

### API 文档

启动后端后访问：

- Knife4j 增强文档：`http://localhost:8100/api/doc.html`
- 默认账号：admin / admin123

### 代码规范

- **后端**：使用 Spotless + Checkstyle (阿里 P3C 规范)

  ```bash
  mvn spotless:apply    # 格式化代码
  mvn checkstyle:check  # 检查代码规范
  ```

- **前端**：使用 ESLint + Prettier

  ```bash
  pnpm lint  # 检查代码规范
  ```

---

## 🎓 适用人群

### 学习者

- **前端开发者**：学习 React 或 Vue 的企业级项目开发
- **后端开发者**：学习 Spring Boot 全栈开发
- **全栈开发者**：了解前后端分离架构的完整实现

### 使用者

- **个人开发者**：快速搭建自己的用户管理系统
- **小型团队**：作为项目的用户中心模块
- **学习平台**：作为教学案例或实训项目

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

---

## 💬 联系方式

如有问题或建议，欢迎通过以下方式联系：

- 提交 Issue
- 发送邮件至：<lingyun2311@gmail.com>

---


<div align="center">
🙏 如果这个项目对你有帮助，欢迎点亮 ⭐️ Star、转发分享、或参与共建。

Made with ❤️ by <a href="https://github.com/mlinyun">mlinyun</a>
</div>
