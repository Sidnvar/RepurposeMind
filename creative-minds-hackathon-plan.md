# Creative Minds Jam #1: Hong Kong 参赛作战简报

## 1. 黑客松硬性要求

### 参赛主题
- 主题聚焦 creator economy / 内容创作者问题
- 必须围绕一个明确赛道做产品

### 三个赛道
1. Audience growth & engagement
   - 帮创作者获客、涨粉、提升互动和留存
2. Content repurposing across platforms
   - 把内容自动改写/改编到不同平台和格式
3. Moderation & community assistance
   - 做智能审核、社区管理、上下文理解与氛围维护

### Minds 关键要求
- 每个提交都必须包含一个 **persistent Mind agent**
- Mind 不能是附属功能，必须是产品核心
- 必须体现至少一种：
  - Memory：跨会话记住上下文
  - Continuity：能接着上次状态继续
  - Autonomous follow-up：能在少量提醒下主动推进任务
- 单智能体和多智能体架构都可以

### 必须提交的材料
1. 可运行产品
2. 展示持久性的证据
3. 明确的 creator-economy 问题匹配
4. 1.5 - 2 分钟 demo video
5. 代码仓库和技术文档

### 评审关注点
- Minds integration depth
- Creator-economy problem fit
- Innovation & creativity
- Execution & completeness
- Viability & scalability

## 2. 时间节点

- 7 月 22 日：Pre-Registration
- 7 月 28 日：Event Launch
- 8 月 28 日：Submission Closes
- 9 月 15 日：Winners Announced

### 截止时间
- 提交截止：**2026-08-28 23:59 HKT**

## 3. 适合你的项目方向

### 方案 A：creator growth copilot
**赛道**：Audience growth & engagement

**做什么**
- 帮创作者分析历史内容表现
- 自动总结“哪类标题、封面、发布时间、话题更容易涨互动”
- 记住创作者的风格和目标，持续给下周选题建议
- 主动提醒：什么时候该发帖、该复盘、该追踪评论

**为什么适合黑客松**
- 很容易体现 persistent Mind
- 能把“记忆”做得很直观
- demo 也容易讲清楚

**技术栈建议**
- 前端：Vue 3 或 React + Vite
- 后端：Node.js + Express
- 智能体编排：Minds + 任务状态存储
- 数据存储：PostgreSQL / SQLite
- 内容分析：OpenAI / Claude / 本地规则分析均可
- 通知：Telegram / Email / Web push

**亮点**
- 记住每个创作者的目标和历史策略
- 每天自动生成一个 growth digest
- 支持“上次你说过的选题”继续往下跟

---

### 方案 B：content repurposing studio
**赛道**：Content repurposing across platforms

**做什么**
- 输入一条长内容：播客、视频、直播稿、长文
- 自动拆成 TikTok 文案、X 帖子、YouTube Short 脚本、小红书文案、newsletter
- 记住每个平台的语气、禁词、长度偏好
- 主动追踪哪些版本已经发布，哪些还没发

**为什么适合黑客松**
- 规则清晰，容易做出完整闭环
- Minds 的连续性很自然：内容从草稿到多平台分发
- 很适合做成“内容运营助手”型 demo

**技术栈建议**
- 前端：React + Next.js 或 Vue 3
- 后端：Node.js + Express
- 智能体：Minds 负责状态、重试、继续任务
- 文本处理：LLM + prompt templates
- 存储：PostgreSQL
- 文件处理：FFmpeg / 简单转写服务可选
- 导出：Markdown / Notion / Google Docs / CSV

**亮点**
- 一次生成多平台版本
- 自动记录发布状态
- 可以做成“发布前检查清单”

---

### 方案 C：community guardian
**赛道**：Moderation & community assistance

**做什么**
- 面向 Discord / Telegram / 评论区
- 根据社群规则自动识别冒犯、广告、重复刷屏、敏感争议
- 记住每个社群的 moderation policy 和历史决策
- 对边缘情况先标记，再请求人工确认
- 主动汇总每日社区热议和风险点

**为什么适合黑客松**
- Minds 的“记忆 + 自主跟进”非常贴题
- 很能体现社区上下文理解
- 适合做成“半自动审核 + 人工兜底”的产品

**技术栈建议**
- 前端：React / Vue
- 后端：Node.js + Express
- Bot 层：Discord / Telegram bot
- 智能体：Minds 处理规则记忆和审核建议
- 存储：PostgreSQL
- 审核引擎：LLM 分类 + 规则引擎
- 日志：Webhook / 队列任务

**亮点**
- 不只是删帖，而是理解社区语境
- 可以展示“本周规则更新后，Mind 自动遵守新 policy”
- 很适合演示持续学习

## 4. 我的优先推荐

如果目标是 **高完成度 + 好讲故事 + 容易展示 Minds 的优势**，我建议优先选：

1. **方案 A：creator growth copilot**
2. **方案 B：content repurposing studio**
3. **方案 C：community guardian**

原因很直接：
- A 最容易把“记忆、连续性、自动跟进”讲透
- B 最容易做出完整产品闭环
- C 最贴 Minds 的长期上下文能力，但审核边界和规则会更复杂

## 5. 选定项目后的开发节奏模板

下面是一版按 **4 周** 设计的节奏。你要求要预留几天整理材料，所以我会把最后几天单独留出来。

### 第 1 周：定义和搭骨架
- 明确用户故事、核心流程、Minds 的职责边界
- 定数据结构：创作者画像、任务状态、历史决策、待办队列
- 搭前后端骨架
- 接通 Minds 基础能力
- 做最小可用 demo 流程

### 第 2 周：实现核心能力
- 完成主要业务流程
- 做持久化记忆
- 做跨会话 continuity
- 做自动 follow-up 机制
- 接入消息通知或任务提醒

### 第 3 周：打磨体验和稳定性
- 优化界面
- 处理异常状态
- 补日志和可观测性
- 补演示数据
- 录制前先跑完整流程

### 第 4 周：预留整理材料
- **前 3 天：整理提交材料**
  - README
  - 技术文档
  - 架构图
  - 关键流程说明
- **中 2 天：录 demo video**
- **最后 2 天：修 bug、补说明、最终提交**

## 6. 你现在可以怎么选

你可以直接从下面三项里选一个，我再按那个方向继续细化：
- A：creator growth copilot
- B：content repurposing studio
- C：community guardian

你选定后，我下一步会继续给你：
- 产品功能拆解
- Minds 具体怎么嵌进去
- 页面结构
- 数据结构
- 详细到天的开发排期
