# Repurpose Mind — 黑客松 Build 提交草稿（copy-paste ready）

> 本文件是「创建 build」时可直接复制进表单的文案。
> 赛道已定：**Content repurposing across platforms**（方案 B）。

---

## Build 表单字段速填表

按你给出的字段名一一对应：

| 字段 | 内容 |
|---|---|
| **name** | Repurpose Mind |
| **logo** | `assets/logo.png`（1024×1024 PNG）<br>矢量源文件：`assets/logo.svg` |
| **vision** | Repurpose Mind envisions a creator economy where no idea is locked to a single platform. We build a persistent Mind that remembers each creator's voice and effortlessly reshapes one piece of content into many — turning repurposing from tedious rework into a single, intelligent step. |
| **category** | Content repurposing across platforms |
| **github** | https://github.com/Sidnvar/RepurposeMind |
| **demo video** | https://youtu.be/Adag7y4-HwA |
| **Social links** | - YouTube: https://www.youtube.com/channel/UCOUcfkJfii3p2ndvcS9U31g<br>- GitHub: https://github.com/Sidnvar/RepurposeMind |

---

> 下面是各字段的**中文说明与扩展版文案**，便于你按需复制长文本。

## 1. Project Name（项目名称）
**Repurpose Mind**

## 2. Tagline / One-liner（一句话简介）
**One source, five platforms — a persistent Mind that learns your voice and repurposes content for you, every time.**

（中文备选：一条内容，五平台分发；会记住你风格的持久化 Mind，每次都替你改写。）

## 3. Problem（要解决的 creator-economy 问题）
Creators write one great piece of content, then must manually rewrite it for X, TikTok, YouTube, 小红书 and Newsletter — each with different format, tone and length. That rework is slow, inconsistent, and doesn't scale.

（创作者写好一篇内容后，要为 X / TikTok / YouTube / 小红书 / Newsletter 各自重写一遍——格式、语气、长度全不同。手动改编既慢又难保证风格统一，无法规模化。）

## 4. Solution（产品方案）
Repurpose Mind turns one long-form source into five platform-native drafts in one click. After every repurpose, the persistent Mind extracts and **remembers** the creator's brand voice, preferred platforms and length, then applies it automatically to the next draft. Profiles and memory are isolated per language (EN / 简体中文 / 繁體中文).

（一键把一篇长内容改写成五个平台原生版本。每次改编后，持久化 Mind 会提炼并记住创作者的品牌语气、偏好平台与长度，下一稿自动套用。画像与记忆按语言隔离，三语互不干扰。）

## 5. Demo Video（演示视频，1.5–2 分钟）
- YouTube：https://youtu.be/Adag7y4-HwA
- 本地备份：`demo/repurpose-mind-demo-en.mp4`（1:52，英文 UI + 英文旁白）

## 6. Repository & Docs（代码仓库与技术文档）
- GitHub：https://github.com/Sidnvar/RepurposeMind
- 技术文档（中/英）：`README.md` / `README.en.md` / `ARCHITECTURE.md` / `ARCHITECTURE.en.md`
- 提交清单与评审映射：`SUBMISSION.md`

## 7. How it uses Minds（硬性要求：persistent Mind 是核心）
本项目以 **persistent Mind agent** 为核心，而非附属功能，体现全部三种能力：

| 能力 | 如何体现 | 证据 |
|---|---|---|
| **Memory** | 品牌语气、目标平台、历史偏好存 SQLite，跨会话 / 跨进程重启均不丢失 | `scripts/persistence-demo.mjs` 输出 `PASS`；`GET /api/profile?lang=` 返回该语言记忆 |
| **Continuity** | 原稿 / 版本 / 待办任务全部持久化；刷新页面或重启服务后状态完全一致 | demo 第 7 镜「刷新后记忆仍在」；`/api/tasks` 待办跨会话接续 |
| **Autonomous follow-up** | 改编后 Mind 自动提炼偏好并回写，无需重复指令；待办区提示「哪些版本已发布 / 待发布」 | `learnFromRepurpose()` 自动写回画像；任务面板持续跟踪分发状态 |

## 8. Tech Stack（技术栈）
- 前端：React + Vite（工作台 + 调试页）
- 后端：Node.js + Express + `node:sqlite`（内置 SQLite，无第三方 DB 依赖）
- 智能层：OpenAI 兼容 LLM（配置驱动，默认 mock 规则模板回退）
- 持久化：SQLite（`mind_memory`、`creator_profile` 按语言隔离）
- 工具：Playwright（demo 录制）、FFmpeg（配音混流）

## 9. Links（相关链接）
- GitHub：https://github.com/Sidnvar/RepurposeMind
- Demo：https://youtu.be/Adag7y4-HwA
- 作者频道：https://www.youtube.com/channel/UCOUcfkJfii3p2ndvcS9U31g

## 10. Team（团队）
- 参赛方式：**个人参赛（Solo）**
- 成员：**Sidnvar**（GitHub: [@Sidnvar](https://github.com/Sidnvar)；频道: https://www.youtube.com/channel/UCOUcfkJfii3p2ndvcS9U31g）
- 如需在表单里填「团队名称 / 成员角色」，直接用上面信息即可。

## 11. Screenshots（截图，可选）
- 可补充：工作台创建原稿、五平台版本并排、Mind 记忆面板、语言切换。
- （如需我用 Playwright 截取并嵌入，告诉我即可。）
