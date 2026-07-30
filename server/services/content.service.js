import { db } from "../db.js";
import { isLLMEnabled, callLLM } from "../llm.js";
import { getMindContext, addLearnedPreference } from "./profile.service.js";

const platformTemplates = {
  x: { label: "X", style: "short hook, punchy value, one clear CTA" },
  tiktok: { label: "TikTok", style: "spoken hook, fast pace, on-screen text idea" },
  youtube: { label: "YouTube", style: "description with chapter-style summary" },
  xiaohongshu: { label: "Xiaohongshu", style: "relatable first line, emoji, personal takeaway" },
  newsletter: { label: "Newsletter", style: "editorial intro, bullet highlights, sign-off" }
};

// 每个平台的具体约束，写进 LLM 的 user prompt（比 style 更硬的指标）
const platformConstraints = {
  x: "输出不超过 280 字符；用强 hook 开头抓住注意力；结尾给 1 个清晰的 CTA；可写成 1-2 条 thread。",
  tiktok: "写成适合口播的短视频脚本：前 3 秒必须有强钩子；口语化、节奏快；适当用 emoji；可标注画面/字幕建议。",
  youtube: "给出：【标题】+【视频描述】+【建议章节时间戳】；描述里带 SEO 关键词与一句订阅引导。",
  xiaohongshu: "种草语气、真诚个人化；emoji 密集；分段清晰；末尾带 2-4 个 #话题标签。",
  newsletter: "写成邮件通讯长文：有引言、3-5 个要点列表、结尾 CTA；结构清晰、可读性强。",
};

// 语言 → 人类可读名称（用于 LLM 输出语言约束）
const LANG_NAMES = {
  en: "English",
  "zh-CN": "简体中文",
  "zh-TW": "繁体中文",
};

// 语言强约束：明确指定输出语言（Step 5 改为按 UI 选择的语言，而不是从文本猜）
function langRule(lang) {
  const name = LANG_NAMES[lang] || "简体中文";
  if (lang === "en") {
    return (
      "【HARD RULE · Language】You MUST write the entire output in English only. " +
      "Do not translate into or mix in any other language (proper nouns and brand names excepted). " +
      "This is a non-negotiable bottom line."
    );
  }
  return (
    `【硬性要求·语言】输出语言必须严格使用${name}，不得混用其他语言` +
    `（专有名词、品牌名除外）。这是不可违背的底线。`
  );
}

export function listContent() {
  const sources = db.prepare("SELECT * FROM content_sources ORDER BY id DESC").all();
  const versions = db.prepare("SELECT * FROM content_versions ORDER BY id DESC").all();
  return { sources, versions };
}

export function createContentSource({ userId, title, originalText, sourceType = "long_form" }) {
  const result = db
    .prepare("INSERT INTO content_sources (user_id, title, original_text, source_type) VALUES (?, ?, ?, ?)")
    .run(userId, title, originalText, sourceType);

  return { id: Number(result.lastInsertRowid) };
}

// 原规则模板：作为 mock 模式 / LLM 失败时的回退（按语言给最简桩文本）
export function buildPlatformVersionRule(originalText, platform, tone, lang = "zh-CN") {
  const template = platformTemplates[platform] || { label: platform, style: "concise adaptation" };
  const cleanText = String(originalText || "").trim();
  const summary = cleanText.slice(0, 140);
  const suffix = cleanText.length > 140 ? "..." : "";

  const cta = lang === "en" ? "CTA: engage, comment, and share." : "行动号召：互动、评论、转发。";
  const approachLabel = lang === "en" ? "Approach" : "思路";

  return [
    `[${template.label}] tone: ${tone}`,
    `${approachLabel}: ${template.style}`,
    "",
    summary + suffix,
    "",
    cta,
  ].join("\n");
}

// 主入口：优先用 LLM 生成，未启用或失败则回退规则模板
// context: { title, memory, brandVoice }（Step 4 会喂入 Mind 记忆）；lang 决定输出语言（Step 5）
export async function buildPlatformVersion(originalText, platform, tone, context = {}, lang = "zh-CN") {
  const label = platformTemplates[platform]?.label || platform;
  const style = platformTemplates[platform]?.style || "concise adaptation";
  const constraint = platformConstraints[platform] || "按目标平台调性改写，保留核心信息。";

  const contextLines = [];
  if (context.brandVoice) contextLines.push(`创作者的品牌语气：${context.brandVoice}`);
  if (context.memory) contextLines.push(`创作者的长期记忆偏好：\n${context.memory}`);
  if (Array.isArray(context.targetPlatforms) && context.targetPlatforms.length)
    contextLines.push(`创作者的目标分发平台：${context.targetPlatforms.join("、")}`);

  const rule = langRule(lang);

  const system =
    "你是资深的跨平台内容改编专家。" +
    "任务：基于一篇原稿，按目标平台的调性改写成符合其格式与长度规范的版本，" +
    "必须保留原稿的核心信息与关键论点，不得编造事实。" +
    "\n" + rule +
    (contextLines.length ? `\n\n${contextLines.join("\n")}` : "");

  const user =
    `原稿标题/主题：${context.title || "（未提供）"}\n\n` +
    `【原稿全文】\n${originalText}\n\n` +
    `目标平台：${label}\n` +
    `平台风格要求：${style}\n` +
    `具体约束：${constraint}\n` +
    `整体语气：${tone}\n\n` +
    `${rule}\n` +
    `请直接输出该平台的改编内容，不要加解释、不要用 markdown 代码块包裹。`;

  // 未启用 LLM：直接走规则模板（mock 模式，不烧钱）
  if (!isLLMEnabled()) {
    return buildPlatformVersionRule(originalText, platform, tone, lang);
  }

  try {
    return await callLLM({ system, user, platform });
  } catch (e) {
    console.error(`[LLM] ${platform} 生成失败，回退规则模板：`, e.message);
    return buildPlatformVersionRule(originalText, platform, tone, lang);
  }
}

export async function createRepurposedVersions({ sourceId, platforms, tone, context = {}, learn = true, lang = "zh-CN" }) {
  const source = db.prepare("SELECT * FROM content_sources WHERE id = ?").get(sourceId);
  if (!source) {
    return null;
  }

  // Step 4 核心：自动拉取持久 Mind 上下文，使每次改编都带上创作者的长期偏好（按语言隔离）
  const mind = getMindContext(lang);
  const mergedContext = {
    brandVoice: context.brandVoice ?? mind.brandVoice,
    memory: context.memory ?? mind.memory,
    targetPlatforms: context.targetPlatforms ?? mind.targetPlatforms,
  };

  // 1) 先并行生成所有平台版本（LLM 调用不进事务，避免长锁）
  const generated = await Promise.all(
    platforms.map(async (platform) => {
      const versionText = await buildPlatformVersion(source.original_text, platform, tone, {
        ...mergedContext,
        title: source.title,
      }, lang);
      return { platform, versionText };
    })
  );

  // 2) 短事务：只做落库
  const created = [];
  try {
    db.exec("BEGIN");
    const insertVersion = db.prepare(
      "INSERT INTO content_versions (source_id, platform, version_text, status, tone) VALUES (?, ?, ?, ?, ?)"
    );

    for (const { platform, versionText } of generated) {
      const result = insertVersion.run(sourceId, platform, versionText, "draft", tone);
      created.push({ id: Number(result.lastInsertRowid), platform });
    }

    db.prepare("INSERT INTO follow_up_tasks (user_id, source_id, task_type, status, due_at, note) VALUES (?, ?, ?, ?, ?, ?)").run(
      source.user_id,
      sourceId,
      "review_versions",
      "open",
      new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      `Review generated versions for ${source.title}.`
    );
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }

  // 3) 可选：让 Mind 从本次改编中学习偏好并回写（best-effort，绝不阻塞主流程；按语言隔离）
  if (learn) {
    try {
      await learnFromRepurpose({ source, versions: generated, tone, lang });
    } catch (e) {
      console.error("[Mind] 偏好回写异常（已忽略）：", e.message);
    }
  }

  return { sourceId, created };
}

// 让 LLM 从一次改编中提炼可复用偏好，回写到 mind_memory（持续的 Mind 记忆，按语言隔离）
export async function learnFromRepurpose({ source, versions, tone, lang = "zh-CN" }) {
  if (!isLLMEnabled()) return;

  const samples = versions
    .map((v) => `【${v.platform}】\n${String(v.versionText || "").slice(0, 500)}`)
    .join("\n\n");

  const langName = LANG_NAMES[lang] || "简体中文";
  const learnRule = lang === "en"
    ? "Output the preferences in English only."
    : `提炼出的偏好必须用${langName}表述。`;

  const system =
    "你是内容策略分析师。基于创作者的原稿与本次多平台改编结果，" +
    "提炼 1-3 条【可长期复用】的内容偏好（例如：'X 帖子偏好短句强钩子'、'多用 emoji 与话题标签'、'避免行话，用口语'）。" +
    "只输出 JSON 字符串数组，不要解释，不要使用 markdown 代码块。" +
    learnRule;

  const user =
    `原稿标题：${source.title}\n` +
    `整体语气：${tone}\n\n` +
    `【本次改编样本】\n${samples}\n\n` +
    `请输出 JSON 数组（示例：["偏好A","偏好B"]）。`;

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 20000);
  try {
    const raw = await callLLM({ system, user, platform: "newsletter", signal: ac.signal });
    const cleaned = raw.replace(/```json|```/g, "").trim();
    let prefs;
    try {
      prefs = JSON.parse(cleaned);
    } catch {
      // 退路：按行/分隔符解析成数组
      prefs = cleaned
        .replace(/^\[|\]$/g, "")
        .split(/[",]/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (Array.isArray(prefs)) {
      for (const pref of prefs.slice(0, 3)) {
        if (typeof pref === "string" && pref.trim()) addLearnedPreference(pref.trim(), lang);
      }
    }
  } catch (e) {
    console.error("[Mind] 偏好提炼失败（已忽略）：", e.message);
  } finally {
    clearTimeout(timer);
  }
}

export function updateVersionStatus(versionId, status) {
  db.prepare("UPDATE content_versions SET status = ? WHERE id = ?").run(status, versionId);
  return { ok: true };
}

export function getVersionsBySource(sourceId) {
  return db
    .prepare("SELECT * FROM content_versions WHERE source_id = ? ORDER BY id DESC")
    .all(sourceId);
}
