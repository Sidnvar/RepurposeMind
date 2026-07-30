# 修改日志 (Changelog)

> 本文件记录 Repurpose Mind 项目的所有修改。详细计划见 `DEV_PLAN.md`，对话摘要见 `CONTEXT.md`。

## 2026-07-28
- 整理 Creative Minds Jam 黑客松规则，生成 `creative-minds-hackathon-plan.md`（赛道、截止时间、提交材料、评审点）
- 评估三个赛道开发难度，结论选定 **Content repurposing across platforms**
- 规划 Repurpose Mind MVP 方案（产品定义、Minds 角色、功能清单、技术栈、数据结构、接口、排期）
- 在桌面创建项目文件夹 `Repurpose Mind` 并将工作区迁移过去

## 2026-07-29
- 后端初始化：Express + 分层结构（`routes/controllers/services/utils`）+ `schema.sql` + `db.js`，8 个接口骨架
- 修复：移除 `better-sqlite3`，改用 Node 内置 `node:sqlite`（`DatabaseSync`）
- 修复：`createRepurposedVersions` 增加 `BEGIN/COMMIT/ROLLBACK` 事务；`buildPlatformVersion` 改为按平台差异化生成
- 修复前端 bug：`App.jsx` 原误读 `created.id` / `profileRes.profile` 等，改为从 `{ success, data }` 取值
- 真实 HTTP 全接口验证通过（health / create / repurpose / list / tasks / patch 全绿）
- 排查 `readonly database` 坑（残留进程占库与端口），建立"单实例 + 干净重启"规则
- 新增中文开发调试页 `index_dev.html`（纯 HTML + 原生 JS，5 个区块）
- 将 `index_dev.html` 移入 `client/`，配置 Vite MPA 路由（`main` + `dev` 入口），`API_BASE` 改走 `/api` 代理
- 再次修复 `readonly database`（后端运行时误删 db 文件导致陈旧连接只读），干净重启后端（进程 95808）
- 整理开发计划 → `DEV_PLAN.md`；记录修改日志 → `CHANGELOG.md`；压缩对话 → `CONTEXT.md`
- **前端联调跑通**：重写 `App.jsx` 让工作台真正达到 demo 可用——全中文 UI、平台中文名映射、相对时间显示、状态彩色 badge（草稿黄/待发布蓝/已发布绿、待办红/已完成灰）、loading/error/toast 反馈、empty state、完整接入 8 个接口（含 2 个 PATCH 之前未接）
- 升级 `styles.css`：状态色系统、平台 chip、版本/任务/记忆卡片、alert/toast、相对时间样式
- 新增 `client/public/favicon.svg` 并在两个 HTML 引用，消除 favicon 404
- 用 Playwright + 本机 Chrome 截图验证 5 个场景（初始页 / 表单填写 / 创建后 / 状态切换 / 调试页），浏览器控制台仅 favicon 404（已修复）
- 修复原稿列表与内容版本的 4 个交互问题：① ④⑤ 位置对调 ② 原稿列表分页（每页 6 条）③ 点击原稿获取该原稿的内容版本 ④ 内容版本默认截断预览，可展开全文
- 后端新增接口 `GET /api/content/:id/versions`，按原稿获取版本；前端 `App.jsx` 移除全局 `versions`，引入 `selectedSourceId / selectedVersions / sourcePage / expandedVersions` 状态
- 重启后端（`run_in_background` 稳定托管，PID 5958）；截图验证 4 项修复全部通过：④ 在 ⑤ 前、分页 `1 / 2`、点击原稿版本区更新、截断后 161 字 → 展开 167 字

## 待办（下一步）
- 接 LLM 提升 `buildPlatformVersion` 质量（现在是规则模板拼接，长文会丢失）
- 录制 1.5–2 分钟 demo video
- 编写技术文档 + 架构图
- 准备持久性证据脚本（跨会话演示 Memory + Continuity + Autonomous follow-up）
