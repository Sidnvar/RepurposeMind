# 对话压缩摘要 (Context)

> 本文件是长对话的精简版，用于减少后续上下文长度。
> 详细计划见 `DEV_PLAN.md`；变更记录见 `CHANGELOG.md`。

## 项目
**Repurpose Mind** —— Creative Minds Jam #1（香港）黑客松作品。
persistent Mind 驱动的跨平台内容改编助手。提交截止 **2026-08-28 23:59 HKT**。

## 关键决策
- 赛道：**Content repurposing across platforms**（三赛道中最简单、最易完整闭环）
- 技术栈：React + Vite 前端 / Node + Express 后端 / 内置 `node:sqlite` / 智能层先规则后 LLM
- 协作模式：用户手写接口，助手 review
- 工作区：桌面 `/Users/wuyanzu/Desktop/Repurpose Mind/`（非 WorkBuddy 临时目录）

## 当前状态
- 后端：Express + `node:sqlite`，8 接口全部 HTTP 验证通过（端口 3001）
- 前端：React 工作台全中文 UI + 完整接入 9 接口（原 8 个 + 新增 `GET /api/content/:id/versions`）+ 中文调试页 `index_dev.html`（Vite MPA，端口 5173，`/api` 代理 3001）
- **前端联调已完成**，工作台可点可用：创建原稿 → 选平台 → 改编 → 原稿列表分页/点击 → 看该稿版本（截断预览+展开）→ 切版本状态 → 标记任务完成，完整闭环
- 智能层：仍为规则模板，待接 LLM
- 待办：接 LLM、demo video、技术文档、持久性证据脚本

## 运行
- 后端：`cd server && node index.js`
- 前端：`cd client && npm run dev`
- 调试页：`http://localhost:5173/index_dev.html`
- 正式工作台：`http://localhost:5173/`

## 血泪铁律（务必遵守）
1. 后端运行时**禁止 `rm repurpose-mind.db*`**，否则陈旧连接变只读；重置须先 `pkill -f "node index.js"` 再删重启
2. 前后端各只跑一个实例
3. 后端统一返回 `{ success, data }`，前端从 `data` 取

## 下一步建议
1. 接 LLM 升级 `buildPlatformVersion`（规则模板对长文会丢失，LLM 才能保住关键信息）
2. 准备持久性证据脚本：跨会话演示 Mind 记住所选平台语气 → 下次打开工作台自动复用
3. 录制 1.5–2 分钟 demo video
4. 编写技术文档 + 架构图
