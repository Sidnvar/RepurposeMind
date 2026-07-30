# Repurpose Mind · 黑客松提交资料清单（Creative Minds Jam #1 · Hong Kong）

> 本文件把你报名/提交时需要的所有材料、对应证据、以及评审关注点的落点，整理成一份可对照的清单。
> 参赛赛道：**Content repurposing across platforms**（方案 B）。
> 提交截止：**2026-08-28 23:59 HKT**。

---

## 0. 一句话定位

Repurpose Mind 是一个由 **persistent Mind（记忆）** 驱动的跨平台内容改编助手：输入一篇原稿，自动改写成 X / TikTok / YouTube / 小红书 / Newsletter 的差异化多语言版本，并在每次改编中持续学习创作者的品牌语气与平台偏好。它直接命中黑客松的硬性要求——**Mind 是产品核心，而非附属功能**。

---

## 1. 硬性提交材料对照表

| # | 要求 | 状态 | 位置 / 证据 |
|---|---|---|---|
| 1 | 可运行产品 | ✅ 已完成 | 前端 React + Vite（`:5173`）+ 后端 Express + `node:sqlite`（`:3001`）；`npm run dev` 一键启动 |
| 2 | 展示持久性的证据 | ✅ 已完成 | `scripts/persistence-demo.mjs`：跨进程重启后记忆一致 + 物理落盘，实跑输出 `PASS ✅` |
| 3 | 明确的 creator-economy 问题匹配 | ✅ 已完成 | 见第 2 节「问题与赛道」 |
| 4 | 1.5–2 分钟 demo video | ✅ 已完成 | <https://youtu.be/Adag7y4-HwA>（**1:52**，英文 UI + 英文旁白，正好落在要求区间）；本地备份 `demo/repurpose-mind-demo-en.mp4` |
| 5 | 代码仓库 + 技术文档 | ✅ 已完成 | 已 `git init` 并提交，推送至 <https://github.com/Sidnvar/RepurposeMind>；技术文档齐备（见第 7 节） |

---

## 2. 问题与赛道（creator-economy problem fit）

**痛点**：创作者辛苦写好一篇内容，却要为 X / TikTok / YouTube / 小红书 / Newsletter 各重写一遍——格式、语气、长度全不同，手动改既耗时又难保证风格统一。

**赛道匹配**：`Content repurposing across platforms`——把一条内容自动改写/改编到不同平台与格式。

**价值主张**：
- 一次输入 → 五平台差异化输出（X 短钩子、TikTok 口播、YouTube 章节、小红书种草、Newsletter 长文）。
- 越用越懂你：Mind 在每次改编后提炼并记住你的偏好，下一稿自动带上。
- 三语不互通：EN / 简中 / 繁中 各自独立的创作者画像与记忆。

---

## 3. Minds 三项能力映射（硬性要求：至少体现一种）

| 能力 | 如何体现 | 证据 / 落点 |
|---|---|---|
| **Memory**（跨会话记住上下文） | 品牌语气、目标平台、历史偏好存 SQLite，跨会话、跨进程重启均不丢失 | `persistence-demo.mjs` 输出 `PASS`；`GET /api/profile?lang=` 返回该语言记忆 |
| **Continuity**（接续上次状态继续） | 原稿 / 版本 / 待办任务全部持久化；刷新页面或重启服务后界面与数据完全一致 | demo 第 7 镜「刷新后记忆仍在」；`/api/tasks` 待办跨会话接续 |
| **Autonomous follow-up**（少提示主动推进） | 每次改编后 Mind 自动用 LLM 提炼 1–3 条偏好并回写；改编完成后自动生成发布跟进待办 | `learnFromRepurpose()`（best-effort，20s 超时，不阻塞主流程）；`POST /api/content/:id/repurpose` 落库时生成 follow-up 任务 |

> 三项能力**全部覆盖**，且 Mind 处于产品核心链路（改编 → 学习 → 注入下一稿），不是装饰。

---

## 4. 评审关注点映射

| 评审维度 | 落点 |
|---|---|
| **Minds integration depth** | 第 3 节三项全覆盖；记忆注入 system prompt、按语言隔离、自动学习闭环 |
| **Creator-economy problem fit** | 第 2 节；明确赛道 + 痛点 + 价值 |
| **Innovation & creativity** | 三语隔离 Mind、规则模板 / LLM 双模、零第三方数据库依赖、自动偏好学习 |
| **Execution & completeness** | 9 个接口全部跑通；完整 i18n 与语言切换；待办折叠；调试页；持久性脚本；中英双语文档 |
| **Viability & scalability** | `node:sqlite` 零运维；LLM 走 OpenAI 兼容端点（可换 DeepSeek / Moonshot / 通义 / Ollama）；无 key 时自动 mock 降级不烧钱 |

---

## 5. 评委 / 观众如何快速验证

```bash
# 1) 安装并启动（Node ≥ 22）
npm install
cd client && npm install && cd ..
npm run dev            # 后端 :3001 + 前端 :5173

# 2) 看持久性证据（重启前后记忆一致）
node scripts/persistence-demo.mjs

# 3) 看 demo 视频
open https://youtu.be/Adag7y4-HwA
```

技术细节：`README.md` / `README.en.md`（中英）、`ARCHITECTURE.md` / `ARCHITECTURE.en.md`（含 3 张架构 / 时序 / 记忆闭环图）。

---

## 6. 提交前待办（TODO）

- [x] **初始化 git 仓库并提交** ✅（已 `git init` 并提交，推送至 <https://github.com/Sidnvar/RepurposeMind>；`.env` 与 `*.db` 已在 `.gitignore` 忽略）
- [ ] 决定是否补一版**中文旁白** demo（当前为英文，HK 赛道英文可接受；如需也可加中文版）
- [ ] （可选）在 README / 本文件补充**截图画廊**，增强可读性
- [x] 报名表单填入：GitHub 仓库链接、demo 视频链接（<https://youtu.be/Adag7y4-HwA>）、作者频道（<https://www.youtube.com/channel/UCOUcfkJfii3p2ndvcS9U31g>）

---

## 7. 材料清单速查

| 类别 | 文件 |
|---|---|
| 产品源码 | `server/`（Express + node:sqlite）、`client/`（React + Vite） |
| 持久性证据 | `scripts/persistence-demo.mjs` |
| Demo 视频 | <https://youtu.be/Adag7y4-HwA>（本地备份 `demo/repurpose-mind-demo-en.mp4`） |
| 技术文档（中） | `README.md`、`ARCHITECTURE.md` |
| 技术文档（英） | `README.en.md`、`ARCHITECTURE.en.md` |
| 视频脚本 | `demo/VIDEO_SCRIPT.en.md`、`demo/VIDEO_SCRIPT.zh-CN.md`、`demo/NARRATION.en.md` |
| 本清单 | `SUBMISSION.md` |

---

## 8. 相关链接
- GitHub 仓库：<https://github.com/Sidnvar/RepurposeMind>
- Demo 视频：<https://youtu.be/Adag7y4-HwA>
- 作者 YouTube：<https://www.youtube.com/channel/UCOUcfkJfii3p2ndvcS9U31g>
