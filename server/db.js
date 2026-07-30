import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "repurpose-mind.db");
const schemaPath = path.join(__dirname, "schema.sql");

export const db = new DatabaseSync(dbPath);
db.exec("PRAGMA foreign_keys = ON;");

const ALL_PLATFORMS = ["x", "tiktok", "youtube", "xiaohongshu", "newsletter"];

// 三语言各自的创作者画像（品牌语气 / 目标平台），互不干扰
const SEED_PROFILES = [
  ["zh-CN", "清晰、务实、有活力", JSON.stringify(ALL_PLATFORMS)],
  ["zh-TW", "清晰、務實、有活力", JSON.stringify(ALL_PLATFORMS)],
  ["en", "clear, practical, energetic", JSON.stringify(ALL_PLATFORMS)],
];

export function initDatabase() {
  const schema = fs.readFileSync(schemaPath, "utf8");
  db.exec(schema);
  db.exec("PRAGMA foreign_keys = ON;");

  // —— 幂等迁移（兼容已存在的旧库）——
  // 1) mind_memory 增加 lang 列
  const cols = db.prepare("PRAGMA table_info(mind_memory)").all();
  if (!cols.some((c) => c.name === "lang")) {
    db.exec("ALTER TABLE mind_memory ADD COLUMN lang TEXT NOT NULL DEFAULT 'zh-CN'");
  }
  // 2) 回填历史记忆的 lang（旧数据归入简体中文）
  db.exec("UPDATE mind_memory SET lang = 'zh-CN' WHERE lang IS NULL OR lang = ''");
  // 3) 确保 creator_profile 表存在（schema 已 IF NOT EXISTS，这里再做一次保险）
  db.exec(`CREATE TABLE IF NOT EXISTS creator_profile (
    lang TEXT PRIMARY KEY,
    brand_voice TEXT NOT NULL DEFAULT '',
    target_platforms TEXT NOT NULL DEFAULT '[]'
  )`);
  // 4) 现有库加完 lang 列后，再建该列上的索引（避免 schema 中索引先于列存在而报错）
  db.exec("CREATE INDEX IF NOT EXISTS idx_mind_memory_user_lang ON mind_memory(user_id, lang)");

  const row = db.prepare("SELECT COUNT(*) AS count FROM users").get();
  if (row.count === 0) {
    db.prepare("INSERT INTO users (name, brand_voice, target_platforms) VALUES (?, ?, ?)").run(
      "Creative Creator",
      "clear, practical, energetic",
      JSON.stringify(ALL_PLATFORMS)
    );

    const userInfo = db.prepare("SELECT id FROM users ORDER BY id LIMIT 1").get();
    const userId = userInfo.id;

    db.prepare("INSERT INTO mind_memory (user_id, key, value, lang) VALUES (?, ?, ?, ?)").run(
      userId,
      "platform_tone_x",
      "short, punchy, clear",
      "zh-CN"
    );
    db.prepare("INSERT INTO mind_memory (user_id, key, value, lang) VALUES (?, ?, ?, ?)").run(
      userId,
      "platform_tone_tiktok",
      "hook-driven, concise, energetic",
      "zh-CN"
    );
    db.prepare(
      "INSERT INTO follow_up_tasks (user_id, task_type, status, due_at, note) VALUES (?, ?, ?, ?, ?)"
    ).run(
      userId,
      "publish_reminder",
      "open",
      new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      "Check which platform versions still need publishing."
    );
  }

  // 始终确保三语言画像存在（旧库升级也补上）
  const insCp = db.prepare(
    "INSERT OR IGNORE INTO creator_profile (lang, brand_voice, target_platforms) VALUES (?, ?, ?)"
  );
  for (const [lang, voice, platforms] of SEED_PROFILES) {
    insCp.run(lang, voice, platforms);
  }
}
