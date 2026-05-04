# sourcebot Prompts

> 项目：sourcebot-dev/sourcebot
> 技术栈：Next.js + Go + TypeScript

## 构建与截图命令

**构建：** `docker build -t sourcebot-test /path/to/sourcebot`

**运行：** `docker run -d -p 3000:3000 --name sourcebot-test sourcebot-test && open http://localhost:3000`

**清理：** `docker rm -f sourcebot-test && docker rmi sourcebot-test`

---

## 功能迭代

**1.** 添加数据导出功能，支持 CSV/JSON 格式备份。
**2.** 支持多语言国际化，默认中文，可切换英文。
**3.** 添加用户权限管理，区分管理员和普通用户。
**4.** 支持 Webhook 通知，数据变化时推送到指定 URL。
**5.** 添加移动端适配，优化手机和平板的显示效果。

## Bug 修复

**6.** 修复大数据量时列表加载缓慢，实现分页或虚拟滚动。
**7.** 修复深色模式下部分组件颜色异常。
**8.** 修复搜索功能不支持中文关键词。
**9.** 修复移动端布局在小屏幕上错乱。
**10.** 修复并发操作时的数据冲突问题。

## 重构

**11.** 将数据库操作封装为 Repository 层，解耦业务逻辑。
**12.** 统一 API 错误响应格式，创建全局错误处理中间件。

## 测试

**13.** 为核心 API 编写集成测试，使用内存数据库隔离。
**14.** 为前端核心组件编写单元测试，覆盖渲染和交互。
**15.** 为数据验证逻辑编写单元测试，覆盖边界情况。

## 代码理解

**16.** 解释项目的整体架构设计和技术选型原因。
**17.** 解释数据持久化机制和数据库 Schema 设计。

## DevOps

**18.** 编写 GitHub Actions 多架构（amd64/arm64）Docker 构建流水线。
**19.** 编写 docker-compose.yml 生产部署配置，含健康检查和自动重启。
**20.** 编写数据备份脚本，保留最近 7 天备份。
