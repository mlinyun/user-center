<template>
    <footer class="global-footer">
        <!-- 链接区域 -->
        <div class="footer-links">
            <a-space :size="'small'">
                <template v-for="(link, index) in footerLinks" :key="link.key">
                    <a
                        :href="link.href"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="footer-link"
                    >
                        <component :is="link.icon" />
                        {{ link.title }}
                    </a>
                    <a-divider v-if="index < footerLinks.length - 1" type="vertical" />
                </template>
            </a-space>
        </div>

        <!-- 版权和备案信息 - 单行显示 -->
        <div class="footer-copyright">
            <span>
                Copyright © {{ currentYear }}
                <a :href="GITHUB_URL" target="_blank" rel="noopener noreferrer" class="author-link">
                    凌云 (mlinyun)
                </a>
                All Rights Reserved.
            </span>
            <a-divider type="vertical" :style="{ margin: '0 8px' }" />
            <a
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noopener noreferrer"
                class="beian-link"
            >
                粤ICP备xxxxxxxxxx号-x
            </a>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { GithubOutlined, GlobalOutlined, MailOutlined } from "@ant-design/icons-vue";
import { getCurrentYear } from "@/utils/date";
import { GITHUB_URL } from "@/constants/system.ts";

// 获取当前年份
const currentYear: number = getCurrentYear();

// 页脚链接配置
const footerLinks = [
    {
        key: "backend",
        title: "项目源码",
        href: GITHUB_URL + "/user-center",
        icon: GithubOutlined,
    },
    {
        key: "docs",
        title: "项目文档",
        href: GITHUB_URL + "/user-center/blob/main/README.md",
        icon: GlobalOutlined,
    },
    {
        key: "email",
        title: "联系邮箱",
        href: "mailto:lingyun2311@gmail.com",
        icon: MailOutlined,
    },
];
</script>

<style scoped>
.global-footer {
    text-align: center;
    padding: 16px 50px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 13px;
    background: transparent;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
}

/* 链接区域 */
.footer-links {
    margin-bottom: 12px;
}

.footer-link {
    color: rgba(0, 0, 0, 0.45);
    text-decoration: none;
    transition: color 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.footer-link:hover {
    color: #1890ff;
}

/* 版权和备案信息 */
.footer-copyright {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
}

.author-link {
    color: rgba(0, 0, 0, 0.65);
    text-decoration: none;
    font-weight: 400;
    margin: 0 4px;
}

.author-link:hover {
    color: #1890ff;
}

.beian-link {
    color: rgba(0, 0, 0, 0.45);
    text-decoration: none;
}

.beian-link:hover {
    color: #1890ff;
}
</style>
