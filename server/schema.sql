PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  brand_voice TEXT NOT NULL DEFAULT '',
  target_platforms TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content_sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  original_text TEXT NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'long_form',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS content_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_id INTEGER NOT NULL,
  platform TEXT NOT NULL,
  version_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  tone TEXT NOT NULL DEFAULT 'neutral',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (source_id) REFERENCES content_sources(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mind_memory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lang TEXT NOT NULL DEFAULT 'zh-CN',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 每语言的创作者画像（品牌语气 / 目标平台）：三语言各自独立，互不干扰
CREATE TABLE IF NOT EXISTS creator_profile (
  lang TEXT PRIMARY KEY,
  brand_voice TEXT NOT NULL DEFAULT '',
  target_platforms TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS follow_up_tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  source_id INTEGER,
  task_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  due_at TEXT,
  note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (source_id) REFERENCES content_sources(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_content_sources_user_id ON content_sources(user_id);
CREATE INDEX IF NOT EXISTS idx_content_versions_source_id ON content_versions(source_id);
CREATE INDEX IF NOT EXISTS idx_follow_up_tasks_user_id ON follow_up_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_mind_memory_user_id ON mind_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_creator_profile_lang ON creator_profile(lang);
