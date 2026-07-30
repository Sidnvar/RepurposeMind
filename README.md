# Repurpose Mind

> 一个由 **持久化 Mind（记忆）** 驱动的跨平台内容改编助手 —— 把一篇原稿，自动改写成适配 X / TikTok / YouTube / 小红书 / Newsletter 的多语言版本，并在每次改编中持续学习你的创作偏好。

**Creative Minds Jam #1** 黑客松作品

> 🎬 Demo 视频：<https://youtu.be/Adag7y4-HwA>（英文 UI + 英文旁白，1:52，覆盖 1.5–2 分钟硬性要求；本地备份见 `demo/repurpose-mind-demo-en.mp4`）。
> 📋 提交资料清单、赛道匹配与评审映射见 [`SUBMISSION.md`](./SUBMISSION.md)。

## 🔗 相关链接
- GitHub 仓库：<https://github.com/Sidnvar/RepurposeMind>
- Demo 视频：<https://youtu.be/Adag7y4-HwA>
- 作者 YouTube：<https://www.youtube.com/channel/UCOUcfkJfii3p2ndvcS9U31g>

---

## ✨ 核心特性

- **一篇多平台**：输入原稿 → 一次性生成 5 个平台的差异化版本（X 短钩子、TikTok 口播脚本、YouTube 标题+章节、小红书种草、Newsletter 长文）。
- **持久化 Mind**：创作者的「品牌语气 / 目标平台 / 历史偏好」存在 SQLite，跨会话、跨进程重启都不丢失。
- **越用越懂你**：每次改编后，Mind 会用 LLM 提炼 1–3 条可复用偏好并写回记忆，下一稿自动带上。
- **三语不互通**：English / 简体中文 / 繁體中文，创作者画像与记忆按语言隔离；原稿与版本共享，可被改编成任意语言。
- **零第三方数据库**：后端用 Node 22 内置 `node:sqlite`，开箱即跑；LLM 走 OpenAI 兼容端点，无 key 时自动降级为规则模板（不烧钱）。

---

## 🧱 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18 + Vite 5（MPA：`/` 工作台、`/index_dev.html` 调试页） |
| 后端 | Express + `node:sqlite`（DatabaseSync，无第三方 DB 依赖） |
| 智能层 | Node 22 裸 `fetch` 调用 OpenAI 兼容 `/v1/chat/completions` |
| 运行要求 | **Node ≥ 22**（用到内置 `node:sqlite` 与全局 `fetch`） |

---

## 🚀 快速开始

```bash
# 1) 安装依赖
npm install          # 根目录：后端依赖
cd client && npm install && cd ..

# 2)（可选）配置 LLM
cp server/.env.example server/.env
#   编辑 server/.env，填入 LLM_API_KEY 等；留空则进入 mock 模式（规则模板）

# 3) 同时启动前后端
npm run dev          # 后台：node server/index.js  前台：vite
```

启动后：

- 前端工作台：<http://localhost:5173/>
- 调试页（中文快速验证）：<http://localhost:5173/index_dev.html>
- 后端 API：<http://localhost:3001/api>

> 单独启动：`npm run dev:server`（仅后端，端口 3001） / `npm run dev:client`（仅前端，端口 5173，API 经 Vite 代理到 3001）。

---

## ⚙️ LLM 配置（server/.env）

| 变量 | 说明 | 默认值 |
|---|---|---|
| `LLM_API_KEY` | OpenAI 兼容密钥；**留空 = mock 模式** | 空 |
| `LLM_BASE_URL` | 兼容端点 base | `https://api.openai.com/v1` |
| `LLM_MODEL` | 模型名 | `gpt-4o-mini` |
| `LLM_TEMPERATURE` | 生成温度 | `0.7` |

`.env.example` 里附了 OpenAI / DeepSeek / Moonshot / 通义千问 / 本地 Ollama 五套现成配置，复制取消注释即可。

---

## 🌐 多语言与「不互通」

- 右上角切换 **EN / 简中 / 繁中**，选择持久化到 `localStorage`。
- 「不互通」指**创作者画像 + Mind 记忆按语言隔离**（`creator_profile` 与 `mind_memory` 均带 `lang` 列）；原稿与改编版本是共享资产，可被改编成任意语言。
- 例如：在中文下学到的「X 偏好问题式强钩子」不会污染英文工作区；切到 English 后是全新的画像与空白记忆。

---

## 🧠 Mind（记忆）数据模型

| 表 | 字段 | 作用 |
|---|---|---|
| `creator_profile` | `lang`, `brand_voice`, `target_platforms` | 每语言的创作者画像（种子值已预置三语） |
| `mind_memory` | `user_id`, `key`, `value`, `lang`, `updated_at` | 长期记忆；`learned_pref_*` 由 LLM 自动学习写入（每语言保留最近 10 条），`platform_tone_*` 为种子 |

学习闭环：`改编生成 → 落库 → learnFromRepurpose 用 LLM 提炼偏好 → 回写 mind_memory（best-effort，20s 超时，绝不阻塞主流程）→ 下次改编自动注入 system prompt`。

---

## 📡 API 一览

统一返回 `{ success, data }`（健康检查除外，返回 `{ ok: true }`）。

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/health` | 健康检查 |
| GET | `/api/profile?lang=zh-CN` | 创作者画像 + 该语言记忆 |
| GET | `/api/content` | 原稿列表 + 全部版本 |
| POST | `/api/content` | 创建原稿，body：`{ title, originalText, sourceType }` → `{ id }` |
| POST | `/api/content/:id/repurpose` | 改编，body：`{ platforms[], tone, learn?, lang? }` → `{ sourceId, created:[{id,platform}] }` |
| GET | `/api/content/:id/versions` | 该原稿的版本 |
| PATCH | `/api/versions/:id/status` | 改版本状态 `draft\|ready\|published` |
| GET | `/api/tasks` | 待办任务 |
| PATCH | `/api/tasks/:id/status` | 改任务状态 |

---

## 🛠 脚本

- `scripts/persistence-demo.mjs` —— **持久性证据**：停旧后端 → 起干净实例 → 会话1改编让 Mind 学习 → 直接读 SQLite 证明落盘 → 重启后端（不删库）→ 会话2 断言记忆完全一致 → 再次改编验证历史偏好被注入。实跑输出 `PASS ✅`。

```bash
node scripts/persistence-demo.mjs
```

---

## 📁 目录结构

```
Repurpose Mind/
├─ server/                 # Express + node:sqlite
│  ├─ index.js             # 入口，注册 9 个接口
│  ├─ db.js                # 幂等建表 + 迁移 + 三语 seed
│  ├─ config.js            # 极简 .env 加载器
│  ├─ llm.js               # OpenAI 兼容调用封装（isLLMEnabled / callLLM）
│  ├─ schema.sql           # 表结构
│  ├─ .env / .env.example  # LLM 配置（.env 不提交）
│  ├─ services/            # profile / content / task 业务逻辑
│  ├─ controllers/         # 请求处理
│  └─ routes/              # 路由
├─ client/                 # React + Vite MPA
│  ├─ src/App.jsx          # 工作台（含 i18n 与语言切换器）
│  └─ src/styles.css
└─ scripts/
   └─ persistence-demo.mjs # 持久性证据脚本
```

---

## 📌 运维铁律（开发注意）

- 重置数据库请**先 `pkill -f "node index.js"` 再删 `*.db`**；运行时禁止 `rm` 数据库（陈旧连接会变为只读）。
- 前后端各只跑一个实例。
- `server/.env` 与 `*.db` 已在 `.gitignore` 中忽略。
