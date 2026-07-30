# Repurpose Mind · 开发计划（整合版）

> 黑客松原始规则见 `creative-minds-hackathon-plan.md`；本文是整合后的可执行开发计划。

## 0. 一句话目标
Creative Minds Jam #1（香港）黑客松作品：一个由 **persistent Mind** 驱动的跨平台内容改编助手。
用户输入一段长内容 → Mind 记住创作者偏好 → 自动生成多平台版本 → 持续跟进发布状态。

## 1. 黑客松关键信息
- 主题：creator economy / 内容创作者
- 必须包含 **persistent Mind agent**，且是产品核心（非附属）
- Mind 需体现至少一种：`Memory`（跨会话记忆）/ `Continuity`（接着上次继续）/ `Autonomous follow-up`（主动推进）
- 提交截止：**2026-08-28 23:59 HKT**
- 必交材料：可运行产品、持久性证据、creator-economy 问题匹配、1.5–2 分钟 demo video、代码仓库 + 技术文档
- 评审关注：Minds 集成深度、问题匹配、创新、完成度、可行性

## 2. 选定赛道与理由
**Content repurposing across platforms**（三赛道中最简单）
- 对比：growth/engagement = 中等难度；moderation = 中高难度（易卡规则与误判）
- 本赛道需求边界清晰、最容易做完整闭环、最易展示 Mind 的连续性，开发周期最短、演示风险最低

## 3. 产品定义
- 名称：**Repurpose Mind**
- MVP 只做 4 件事：① 收原稿 ② 记上下文 ③ 做改编 ④ 跟状态
- 支持平台（4–5 个）：X / TikTok / YouTube / 小红书 / Newsletter
- Mind 角色：记忆创作者画像、平台语气、发布状态；主动追问缺失信息；提醒未完成任务；生成每周进度

## 4. 技术栈
- 前端：React + Vite（工作台）+ 独立中文调试页 `index_dev.html`
- 后端：Node.js + Express
- 数据库：**SQLite（Node 内置 `node:sqlite`，无第三方数据库依赖）**
- 智能层：当前为规则模板生成（`buildPlatformVersion`），后续接 LLM
- 说明：后端 HTTP 仍依赖 `express` / `cors`，尚未改为零依赖

## 5. 目录结构
```
Repurpose Mind/
├── server/                # Node/Express 后端
│   ├── index.js           # 入口，挂载路由，端口 3001
│   ├── db.js              # node:sqlite 初始化 + seed 默认用户/记忆
│   ├── schema.sql         # 建表 SQL
│   ├── package.json
│   ├── controllers/       # 请求处理（收参/校验/调 service/返回）
│   ├── services/          # 业务逻辑 + SQL
│   ├── routes/            # 路由映射
│   └── utils/response.js  # 统一返回 {success,data}
├── client/                # React + Vite 前端
│   ├── index.html         # React 工作台 (MPA: main)
│   ├── index_dev.html     # 中文开发调试页 (MPA: dev)
│   ├── vite.config.js     # appType:mpa + /api 代理 3001
│   └── src/               # App.jsx / main.jsx / styles.css
├── creative-minds-hackathon-plan.md
├── README.md
├── DEV_PLAN.md
├── CHANGELOG.md
├── CONTEXT.md
└── package.json
```

## 6. 数据模型（5 张表）
- `users`: id, name, brand_voice, target_platforms, created_at
- `content_sources`: id, user_id, title, original_text, source_type, created_at
- `content_versions`: id, source_id, platform, version_text, status(draft/ready/published), tone, created_at
- `mind_memory`: id, user_id, key, value, updated_at
- `follow_up_tasks`: id, user_id, source_id, task_type, status(open/done), due_at, note, created_at

## 7. API 清单
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| GET | `/api/profile` | 创作者画像 + mind_memory |
| GET | `/api/content` | content_sources + content_versions |
| POST | `/api/content` | 创建原稿，返回 `{ id }` |
| POST | `/api/content/:id/repurpose` | 生成多平台版本 + 建 follow-up 任务 |
| GET | `/api/content/:id/versions` | 按原稿获取对应版本 |
| PATCH | `/api/versions/:id/status` | 更新版本状态 |
| GET | `/api/tasks` | 待办任务 |
| PATCH | `/api/tasks/:id/status` | 更新任务状态 |

返回结构统一：`{ success, message, data }`

## 8. 开发排期（建议 10 天开发 + 3 天材料）
- D1 定边界/结构/数据，接 Minds 基础
- D2 前端工作台骨架（输入/平台/草稿列表）
- D3 后端 API + 内容存储
- D4 内容改编逻辑（多平台生成）
- D5 接 Mind 记忆（creator profile + platform preference）
- D6 follow-up 任务系统（主动追问）
- D7 发布状态看板
- D8 打磨 UI + 异常处理
- D9 全流程联调 + demo 数据
- D10 录制前最终修复
- +3 天：README / 技术文档 / 架构图 + 录 1.5–2 分钟 demo video + 最终提交

## 9. 提交材料清单
- [ ] 可运行产品（前后端）
- [ ] 持久性证据（多会话演示脚本）
- [ ] demo video 1.5–2 分钟
- [ ] 代码仓库 + README
- [ ] 技术文档 + 架构图
- [ ] creator-economy 问题匹配说明

## 10. 当前进度
- ✅ 赛道选定 + 产品定义
- ✅ 后端骨架（Express + node:sqlite，9 接口）
- ✅ 前端 React 工作台骨架 + 中文调试页 `index_dev.html`
- ✅ Vite MPA 路由（`/` 与 `/index_dev.html`）
- ✅ 全接口 HTTP 验证通过
- ✅ **前端联调跑通**：工作台完整闭环（创建 → 改编 → 原稿列表分页点击 → 版本管理 → 任务跟进），9 接口全部接入，含 2 个 PATCH
- ✅ favicon + 截图验证
- ✅ 原稿列表/内容版本 4 个交互修复已验证
- 🟡 智能层仍为规则模板，待接 LLM
- ⬜ demo video + 技术文档 + 架构图
- ⬜ 持久性证据脚本（跨会话演示 Mind）

## 11. 运行方式
- 后端：`cd server && node index.js`（端口 3001）
- 前端：`cd client && npm run dev`（端口 5173，`/api` 代理到 3001）
- 调试页：`http://localhost:5173/index_dev.html`

## 12. 关键铁律（避免重复踩坑）
1. 后端运行时**绝不用 `rm` 删 `repurpose-mind.db*`**；要重置须先 `pkill -f "node index.js"` 再删文件重启
2. 同一时间只跑一个后端实例、一个前端实例
3. 后端返回统一 `{ success, data }`，前端从 `data` 取值
