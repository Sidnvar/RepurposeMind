import { db } from "../db.js";

const DEFAULT_LANG = "zh-CN";

function getCreatorProfile(lang) {
  return db.prepare("SELECT brand_voice, target_platforms FROM creator_profile WHERE lang = ?").get(lang);
}

export function getProfile(lang = DEFAULT_LANG) {
  const profile = db.prepare("SELECT * FROM users ORDER BY id LIMIT 1").get();
  if (!profile) return { profile: null, memory: [] };

  // 品牌语气 / 目标平台按语言隔离（来自 creator_profile）
  const cp = getCreatorProfile(lang) || { brand_voice: "", target_platforms: "[]" };
  const memory = db
    .prepare(
      "SELECT key, value, updated_at FROM mind_memory WHERE user_id = ? AND lang = ? ORDER BY updated_at DESC"
    )
    .all(profile.id, lang);

  return {
    profile: {
      id: profile.id,
      name: profile.name,
      brand_voice: cp.brand_voice || "",
      target_platforms: cp.target_platforms || "[]",
      lang,
    },
    memory,
  };
}

// Step 4 + Step 5：把持久 Mind 整理成可直接塞进 LLM system prompt 的上下文（按语言隔离）
// 返回 { brandVoice, memory(多行文本), targetPlatforms(数组) }
export function getMindContext(lang = DEFAULT_LANG) {
  const profile = db.prepare("SELECT * FROM users ORDER BY id LIMIT 1").get();
  if (!profile) return { brandVoice: "", memory: "", targetPlatforms: [] };

  const cp = getCreatorProfile(lang) || { brand_voice: "", target_platforms: "[]" };

  const memoryRows = db
    .prepare("SELECT key, value FROM mind_memory WHERE user_id = ? AND lang = ? ORDER BY updated_at DESC")
    .all(profile.id, lang);

  const memoryText = memoryRows.length
    ? memoryRows.map((m) => `- ${m.key}: ${m.value}`).join("\n")
    : "";

  let targetPlatforms = [];
  try {
    targetPlatforms = JSON.parse(cp.target_platforms || "[]");
  } catch {
    targetPlatforms = [];
  }

  return {
    brandVoice: cp.brand_voice || "",
    memory: memoryText,
    targetPlatforms,
  };
}

// Step 4 + Step 5：让 Mind 从改编中学习偏好并回写（按语言隔离，滚动保留最近 10 条）
export function addLearnedPreference(pref, lang = DEFAULT_LANG) {
  const profile = db.prepare("SELECT * FROM users ORDER BY id LIMIT 1").get();
  if (!profile) return;

  db.prepare("INSERT INTO mind_memory (user_id, key, value, lang) VALUES (?, ?, ?, ?)").run(
    profile.id,
    `learned_pref_${Date.now()}`,
    pref,
    lang
  );

  // 只保留该语言下最近 10 条 learned 偏好
  const learned = db
    .prepare(
      "SELECT id FROM mind_memory WHERE user_id = ? AND lang = ? AND key LIKE 'learned_pref_%' ORDER BY updated_at DESC"
    )
    .all(profile.id, lang);

  if (learned.length > 10) {
    const ids = learned.slice(10).map((r) => r.id);
    db.prepare(`DELETE FROM mind_memory WHERE id IN (${ids.map(() => "?").join(",")})`).run(...ids);
  }
}
