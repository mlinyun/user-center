import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/",
  lang: "zh-CN",
  title: "凌云用户中心系统",
  description:
    "凌云用户中心系统文档 — 静态文档站点，提供安装与快速上手、接口与配置说明、权限与认证示例以及部署与运维指南，面向开发者与运维人员的详细参考。",
  head: [["link", { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]],
  srcDir: "./src",
  markdown: {
    lineNumbers: true,
  },
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/user-center-logo.svg",
    siteTitle: "凌云用户中心系统",
    nav: [
      {
        text: "首页",
        link: "/",
      },
      {
        text: "项目介绍",
        link: "/introduce/project-introduction",
      },
      {
        text: "项目设计",
        items: [
          {
            text: "文档01 项目演示",
            link: "/design/project-demonstration",
          },
          {
            text: "文档02 需求分析",
            link: "/design/requirement-analysis",
          },
          {
            text: "文档03 数据库设计",
            link: "/design/database-design",
          },
          {
            text: "文档04 接口文档",
            link: "/design/api-documentation",
          },
        ],
      },
      {
        text: "项目开发",
        items: [
          {
            text: "文档05 前端代码初始化",
            link: "/develop/frontend-initialization",
          },
          {
            text: "文档06 后端代码初始化",
            link: "/develop/backend-initialization",
          },
          {
            text: "文档07 项目数据库设计",
            link: "/develop/project-database-design",
          },
          {
            text: "文档08 实现登录注册功能",
            link: "/develop/authentication-implementation",
          },
          {
            text: "文档09 实现用户管理功能",
            link: "/develop/user-management",
          },
          {
            text: "文档10 前端页面魔改与功能实现",
            link: "/develop/frontend-enhancements",
          },
          {
            text: "文档11 前后端项目优化",
            link: "/develop/project-optimization",
          },
          {
            text: "文档12 前端项目重新出发",
            link: "/develop/frontend-rework",
          },
        ],
      },
      {
        text: "项目部署",
        items: [
          {
            text: "文档13 项目部署方案",
            link: "/deploy/deployment-environment",
          },
          {
            text: "文档14 后端项目部署",
            link: "/deploy/backend-deployment",
          },
          {
            text: "文档15 前端项目部署",
            link: "/deploy/frontend-deployment",
          },
        ],
      },
    ],

    sidebar: {
      "/introduce/": [
        {
          text: "文档00 项目介绍",
          link: "/introduce/project-introduction",
        },
      ],
      "/design/": [
        {
          text: "文档01 项目演示",
          link: "/design/project-demonstration",
        },
        {
          text: "文档02 需求分析",
          link: "/design/requirement-analysis",
        },
        {
          text: "文档03 数据库设计",
          link: "/design/database-design",
        },
        {
          text: "文档04 接口文档",
          link: "/design/api-documentation",
        },
      ],
      "/develop/": [
        {
          text: "文档05 前端代码初始化",
          link: "/develop/frontend-initialization",
        },
        {
          text: "文档06 后端代码初始化",
          link: "/develop/backend-initialization",
        },
        {
          text: "文档07 项目数据库设计",
          link: "/develop/project-database-design",
        },
        {
          text: "文档08 实现登录注册功能",
          link: "/develop/authentication-implementation",
        },
        {
          text: "文档09 实现用户管理功能",
          link: "/develop/user-management",
        },
        {
          text: "文档10 前端页面魔改与功能实现",
          link: "/develop/frontend-enhancements",
        },
        {
          text: "文档11 前后端项目优化",
          link: "/develop/project-optimization",
        },
        {
          text: "文档12 前端项目重新出发",
          link: "/develop/frontend-rework",
        },
      ],
      "/deploy/": [
        {
          text: "文档13 部署环境准备",
          link: "/deploy/deployment-environment",
        },
        {
          text: "文档14 后端项目部署",
          link: "/deploy/backend-deployment",
        },
        {
          text: "文档15 前端项目部署",
          link: "/deploy/frontend-deployment",
        },
      ],
    },

    outline: [2, 3],
    outlineTitle: "本页目录",
    socialLinks: [
      { icon: "github", link: "https://github.com/mlinyun/user-center" },
    ],
    editLink: {
      pattern:
        "https://github.com/mlinyun/user-center/blob/main/user-center-docs/docs/src/:path",
      text: "在 GitHub 上编辑此页面",
    },
    docFooter: { prev: "上一篇", next: "下一篇" },
    lastUpdatedText: "最近更新时间",
    footer: {
      message:
        '版权所有 © 2025 mlinyun &nbsp;&nbsp; \
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" style="text-decoration:none; color:inherit">粤ICP备xxxxxxxxxx号-x</a>',
      copyright:
        "文档内容仅供参考，未经书面许可，不得复制、转载或用于商业用途。文档中示例代码的许可以仓库中的 LICENSE 文件为准",
    },
  },
});
