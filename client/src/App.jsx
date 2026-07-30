import React, { useEffect, useMemo, useState, useCallback } from "react";

// ===== 三语字典 =====
const I18N = {
  en: {
    appTitle: "Cross-platform Repurposing Workbench",
    connecting: "Connecting…",
    connected: "Connected",
    alertTitle: "Notice",
    step1Title: "① Create Source & Generate Multi-platform Adaptations",
    titleLabel: "Title",
    titlePlaceholder: "e.g. New product launch long-form post",
    toneLabel: "Tone",
    originalLabel: "Original Content",
    originalPlaceholder: "Paste a long piece of content; Mind will rewrite it for each platform…",
    targetPlatformsLabel: "Target Platforms",
    createBtn: "Create & Adapt",
    creating: "Generating…",
    hint: "Calls POST /api/content then POST /api/content/:id/repurpose",
    step2Title: "② Mind Memory (Creator Profile)",
    loading: "Loading…",
    brandVoiceLabel: "Brand Voice: ",
    notSet: "Not set",
    targetPlatformsLabel2: "Target Platforms: ",
    rememberedPrefs: "Remembered Preferences",
    noMemory: "No memory yet",
    step3Title: "③ To-do Tasks (Autonomous Follow-up)",
    noTasks: "No tasks",
    markDone: "Mark Done",
    doneHeader: "Done",
    resetTodo: "Reset to To-do",
    step4Title: "④ Source List (click to view its versions)",
    noSources: "No sources yet",
    prev: "Previous",
    next: "Next",
    step5Title: "⑤ Content Versions (from selected source)",
    selectSource: "Select a source above to view its platform versions",
    noVersions: "This source has no versions yet. Generate again in ①",
    expand: "Expand",
    collapse: "Collapse",
    fromLabel: "From: ",
    dueLabel: "Due: ",
    toneSmall: "tone:",
    errRequired: "Please fill in title and original content",
    errPlatform: "Please select at least one target platform",
    toastGenerated: "Generated {n} platform versions",
    loadFail: "Failed to load: ",
    loadVersionsFail: "Failed to load versions: ",
    updateVersionFail: "Failed to update version status: ",
    updateTaskFail: "Failed to update task status: ",
    createFail: "Creation failed: ",
    relJustNow: "just now",
    relMinutes: "{n} minutes ago",
    relHours: "{n} hours ago",
    relDays: "{n} days ago",
  },
  "zh-CN": {
    appTitle: "跨平台内容改编工作台",
    connecting: "连接中…",
    connected: "已连接",
    alertTitle: "提示",
    step1Title: "① 创建原稿并生成多平台改编",
    titleLabel: "标题",
    titlePlaceholder: "例如：新产品发布长文",
    toneLabel: "语气",
    originalLabel: "原稿内容",
    originalPlaceholder: "粘贴一段长内容，Mind 会把它改写成适合不同平台的版本……",
    targetPlatformsLabel: "目标平台",
    createBtn: "创建并改编",
    creating: "生成中…",
    hint: "点击后依次调用 POST /api/content 与 POST /api/content/:id/repurpose",
    step2Title: "② Mind 记忆（创作者画像）",
    loading: "加载中……",
    brandVoiceLabel: "品牌语气：",
    notSet: "未设置",
    targetPlatformsLabel2: "目标平台：",
    rememberedPrefs: "已记住的偏好",
    noMemory: "暂无记忆",
    step3Title: "③ 待办任务（自主跟进）",
    noTasks: "暂无待办",
    markDone: "标记完成",
    doneHeader: "已完成",
    resetTodo: "重置为待办",
    step4Title: "④ 原稿列表（点击查看其内容版本）",
    noSources: "暂无原稿",
    prev: "上一页",
    next: "下一页",
    step5Title: "⑤ 内容版本（来自选中原稿）",
    selectSource: "请选择上方原稿，查看它的各平台版本",
    noVersions: "该原稿暂无版本，可在 ① 重新生成",
    expand: "展开全文",
    collapse: "收起",
    fromLabel: "来自：",
    dueLabel: "到期：",
    toneSmall: "语气：",
    errRequired: "请填写标题和原稿内容",
    errPlatform: "请至少选择一个目标平台",
    toastGenerated: "已生成 {n} 个平台版本",
    loadFail: "加载失败：",
    loadVersionsFail: "加载版本失败：",
    updateVersionFail: "更新版本状态失败：",
    updateTaskFail: "更新任务状态失败：",
    createFail: "创建失败：",
    relJustNow: "刚刚",
    relMinutes: "{n} 分钟前",
    relHours: "{n} 小时前",
    relDays: "{n} 天前",
  },
  "zh-TW": {
    appTitle: "跨平台內容改編工作臺",
    connecting: "連線中…",
    connected: "已連線",
    alertTitle: "提示",
    step1Title: "① 建立原稿並生成多平臺改編",
    titleLabel: "標題",
    titlePlaceholder: "例如：新產品發布長文",
    toneLabel: "語氣",
    originalLabel: "原稿內容",
    originalPlaceholder: "貼上一段長內容，Mind 會把它改寫成適合不同平臺的版本……",
    targetPlatformsLabel: "目標平臺",
    createBtn: "建立並改編",
    creating: "生成中…",
    hint: "點擊後依序呼叫 POST /api/content 與 POST /api/content/:id/repurpose",
    step2Title: "② Mind 記憶（創作者畫像）",
    loading: "載入中……",
    brandVoiceLabel: "品牌語氣：",
    notSet: "未設定",
    targetPlatformsLabel2: "目標平臺：",
    rememberedPrefs: "已記住的偏好",
    noMemory: "暫無記憶",
    step3Title: "③ 待辦任務（自主跟進）",
    noTasks: "暫無待辦",
    markDone: "標記完成",
    doneHeader: "已完成",
    resetTodo: "重設為待辦",
    step4Title: "④ 原稿列表（點擊查看其內容版本）",
    noSources: "暫無原稿",
    prev: "上一頁",
    next: "下一頁",
    step5Title: "⑤ 內容版本（來自選中原稿）",
    selectSource: "請選擇上方原稿，查看它的各平臺版本",
    noVersions: "該原稿暫無版本，可在 ① 重新生成",
    expand: "展開全文",
    collapse: "收起",
    fromLabel: "來自：",
    dueLabel: "到期：",
    toneSmall: "語氣：",
    errRequired: "請填寫標題和原稿內容",
    errPlatform: "請至少選擇一個目標平臺",
    toastGenerated: "已生成 {n} 個平臺版本",
    loadFail: "載入失敗：",
    loadVersionsFail: "載入版本失敗：",
    updateVersionFail: "更新版本狀態失敗：",
    updateTaskFail: "更新任務狀態失敗：",
    createFail: "建立失敗：",
    relJustNow: "剛剛",
    relMinutes: "{n} 分鐘前",
    relHours: "{n} 小時前",
    relDays: "{n} 天前",
  },
};

// 平台名（三语）
const PLATFORM_LABELS = {
  en: { x: "X / Twitter", tiktok: "TikTok", youtube: "YouTube", xiaohongshu: "Xiaohongshu", newsletter: "Newsletter" },
  "zh-CN": { x: "X / Twitter", tiktok: "TikTok", youtube: "YouTube", xiaohongshu: "小红书", newsletter: "邮件通讯" },
  "zh-TW": { x: "X / Twitter", tiktok: "TikTok", youtube: "YouTube", xiaohongshu: "小紅書", newsletter: "電子報" },
};
const ALL_PLATFORMS = ["x", "tiktok", "youtube", "xiaohongshu", "newsletter"];

// 状态标签（三语）
const VERSION_STATUS = {
  en: { draft: { label: "Draft", cls: "draft" }, ready: { label: "Ready", cls: "ready" }, published: { label: "Published", cls: "published" } },
  "zh-CN": { draft: { label: "草稿", cls: "draft" }, ready: { label: "待发布", cls: "ready" }, published: { label: "已发布", cls: "published" } },
  "zh-TW": { draft: { label: "草稿", cls: "draft" }, ready: { label: "待發布", cls: "ready" }, published: { label: "已發布", cls: "published" } },
};
const TASK_STATUS = {
  en: { open: { label: "To-do", cls: "open" }, done: { label: "Done", cls: "done" } },
  "zh-CN": { open: { label: "待办", cls: "open" }, done: { label: "已完成", cls: "done" } },
  "zh-TW": { open: { label: "待辦", cls: "open" }, done: { label: "已完成", cls: "done" } },
};

// 语气选项（三语）
const TONE_OPTIONS = {
  en: [ { value: "neutral", label: "Neutral" }, { value: "clear", label: "Clear" }, { value: "professional", label: "Professional" }, { value: "casual", label: "Casual" }, { value: "promo", label: "Promotional" } ],
  "zh-CN": [ { value: "neutral", label: "中性" }, { value: "clear", label: "清晰" }, { value: "professional", label: "专业" }, { value: "casual", label: "轻松" }, { value: "promo", label: "促销" } ],
  "zh-TW": [ { value: "neutral", label: "中性" }, { value: "clear", label: "清晰" }, { value: "professional", label: "專業" }, { value: "casual", label: "輕鬆" }, { value: "promo", label: "促銷" } ],
};

// 语言切换器选项
const LANGS = [
  { code: "en", short: "EN" },
  { code: "zh-CN", short: "简中" },
  { code: "zh-TW", short: "繁中" },
];

// 原稿列表每页条数
const PAGE_SIZE = 6;

// ===== 相对时间（三语）=====
function relTime(iso, lang) {
  if (!iso) return "—";
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return iso;
  const diff = Date.now() - t;
  const i = I18N[lang] || I18N["zh-CN"];
  if (diff < 60_000) return i.relJustNow;
  if (diff < 3_600_000) return i.relMinutes.replace("{n}", Math.floor(diff / 60_000));
  if (diff < 86_400_000) return i.relHours.replace("{n}", Math.floor(diff / 3_600_000));
  if (diff < 7 * 86_400_000) return i.relDays.replace("{n}", Math.floor(diff / 86_400_000));
  return new Date(iso).toLocaleDateString(lang === "en" ? "en-US" : "zh-CN");
}

// ===== 版本文本截断（不显示全部内容）=====
function truncate(text, n = 160) {
  if (!text) return "";
  return text.length > n ? text.slice(0, n) + "…" : text;
}

// ===== 统一请求封装 =====
async function callApi(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const json = await res.json().catch(() => ({ success: false, message: "返回非 JSON" }));
  if (!res.ok || !json.success) {
    throw new Error(json.message || `HTTP ${res.status}`);
  }
  return json.data;
}

// 默认语言（持久化到 localStorage）
function getInitialLang() {
  try {
    const saved = localStorage.getItem("rm-lang");
    if (saved && I18N[saved]) return saved;
  } catch {
    /* ignore */
  }
  return "zh-CN";
}

export default function App() {
  const [lang, setLang] = useState(getInitialLang);

  // 简易翻译函数（支持 {n} 占位符）
  const t = useCallback(
    (key, vars) => {
      const dict = I18N[lang] || I18N["zh-CN"];
      let s = dict[key] != null ? dict[key] : I18N["zh-CN"][key] != null ? I18N["zh-CN"][key] : key;
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, v);
      return s;
    },
    [lang]
  );

  // 列表数据
  const [profile, setProfile] = useState(null);
  const [memory, setMemory] = useState([]);
  const [sources, setSources] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showDone, setShowDone] = useState(false); // 已完成默认折叠，避免页面过长

  // ④ 原稿列表相关
  const [selectedSourceId, setSelectedSourceId] = useState(null); // 当前选中原稿
  const [sourcePage, setSourcePage] = useState(1);                 // 原稿列表分页
  const [selectedVersions, setSelectedVersions] = useState([]);   // ⑤ 内容版本（点击获取）
  const [expandedVersions, setExpandedVersions] = useState(() => new Set()); // 展开全文的版本 id

  // 表单状态
  const [title, setTitle] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [tone, setTone] = useState("clear");

  // UI 状态
  const [loading, setLoading] = useState(false);     // 创建中
  const [error, setError] = useState("");             // 全局错误
  const [toast, setToast] = useState("");              // 临时提示
  const [initLoading, setInitLoading] = useState(true);

  const changeLang = (next) => {
    if (next === lang) return;
    setLang(next);
    try {
      localStorage.setItem("rm-lang", next);
    } catch {
      /* ignore */
    }
  };

  const sourceTitleMap = useMemo(() => {
    const m = {};
    sources.forEach((s) => (m[s.id] = s.title));
    return m;
  }, [sources]);

  const openTasks = useMemo(() => tasks.filter((t) => t.status === "open"), [tasks]);
  const doneTasks = useMemo(() => tasks.filter((t) => t.status === "done"), [tasks]);

  const pagedSources = useMemo(() => {
    const start = (sourcePage - 1) * PAGE_SIZE;
    return sources.slice(start, start + PAGE_SIZE);
  }, [sources, sourcePage]);
  const totalPages = Math.max(1, Math.ceil(sources.length / PAGE_SIZE));

  const refresh = useCallback(async (preferredSelectedId) => {
    try {
      const [profileData, contentData, tasksData] = await Promise.all([
        callApi(`/profile?lang=${encodeURIComponent(lang)}`),
        callApi("/content"),
        callApi("/tasks"),
      ]);
      setProfile(profileData.profile);
      setMemory(profileData.memory || []);
      const srcs = contentData.sources || [];
      setSources(srcs);
      setTasks(tasksData.tasks || []);
      // 默认选中最新（列表按 id DESC，[0] 即最新）原稿；若调用方指定了优先选中项则优先保留
      setSelectedSourceId((prev) => {
        if (preferredSelectedId && srcs.some((s) => s.id === preferredSelectedId)) {
          return preferredSelectedId;
        }
        return prev && srcs.some((s) => s.id === prev) ? prev : srcs[0]?.id ?? null;
      });
      setError("");
    } catch (e) {
      setError(`${t("loadFail")}${e.message}`);
    } finally {
      setInitLoading(false);
    }
  }, [lang, t]);

  // 点击原稿 → 获取该原稿的内容版本（新接口 GET /api/content/:id/versions）
  const loadVersions = useCallback(async (id) => {
    try {
      const data = await callApi(`/content/${id}/versions`);
      setSelectedVersions(data.versions || []);
    } catch (e) {
      setError(`${t("loadVersionsFail")}${e.message}`);
    }
  }, [t]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // 选中原稿变化时，拉取它的版本
  useEffect(() => {
    if (selectedSourceId != null) loadVersions(selectedSourceId);
  }, [selectedSourceId, loadVersions]);

  // 创建原稿 + 一键改编
  const submitContent = async () => {
    if (!title.trim() || !originalText.trim()) {
      setError(t("errRequired"));
      return;
    }
    if (selectedPlatforms.length === 0) {
      setError(t("errPlatform"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      const created = await callApi("/content", {
        method: "POST",
        body: JSON.stringify({ title: title.trim(), originalText: originalText.trim() }),
      });
      const sourceId = created.id;
      await callApi(`/content/${sourceId}/repurpose`, {
        method: "POST",
        body: JSON.stringify({ platforms: selectedPlatforms, tone, lang }),
      });
      setToast(t("toastGenerated", { n: selectedPlatforms.length }));
      setTitle("");
      setOriginalText("");
      setSourcePage(1);
      await refresh(sourceId);
      // refresh 已按 preferredSelectedId 选中新原稿；再显式拉一次版本确保及时展示
      await loadVersions(sourceId);
      setTimeout(() => setToast(""), 2500);
    } catch (e) {
      setError(`${t("createFail")}${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 切换版本状态
  const updateVersionStatus = async (id, status) => {
    try {
      await callApi(`/versions/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setSelectedVersions((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
    } catch (e) {
      setError(`${t("updateVersionFail")}${e.message}`);
    }
  };

  // 切换任务状态
  const updateTaskStatus = async (id, status) => {
    try {
      await callApi(`/tasks/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    } catch (e) {
      setError(`${t("updateTaskFail")}${e.message}`);
    }
  };

  // 切换平台选择
  const togglePlatform = (p) => {
    setSelectedPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  };

  // 点击原稿：选中 + 跳到该原稿所在的页（effect 会加载其版本）
  const selectSource = (id) => {
    setSelectedSourceId(id);
    const idx = sources.findIndex((s) => s.id === id);
    if (idx >= 0) setSourcePage(Math.floor(idx / PAGE_SIZE) + 1);
  };

  // 展开/收起版本全文
  const toggleExpand = (id) => {
    setExpandedVersions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const targetPlatforms = useMemo(() => {
    if (!profile?.target_platforms) return [];
    try {
      const arr = JSON.parse(profile.target_platforms);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }, [profile]);

  const platLabel = (p) => PLATFORM_LABELS[lang]?.[p] || p;
  const vStatus = (s) => VERSION_STATUS[lang]?.[s] || VERSION_STATUS["zh-CN"][s];
  const tkStatus = (s) => TASK_STATUS[lang]?.[s] || TASK_STATUS["zh-CN"][s];

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="eyebrow">repurpose mind</div>
          <h1>{t("appTitle")}</h1>
        </div>
        <div className="topbar-right">
          <div className="lang-switch" role="group" aria-label="language">
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                className={lang === l.code ? "active" : ""}
                onClick={() => changeLang(l.code)}
              >
                {l.short}
              </button>
            ))}
          </div>
          <span className={`dot ${initLoading ? "loading" : "ok"}`} />
          <span className="dot-text">
            {initLoading ? t("connecting") : t("connected")}
          </span>
        </div>
      </header>

      {error && (
        <div className="alert">
          <strong>{t("alertTitle")}</strong> {error}
          <button className="alert-close" onClick={() => setError("")}>×</button>
        </div>
      )}
      {toast && <div className="toast">{toast}</div>}

      <main className="grid">
        {/* ① 创建原稿 */}
        <section className="panel wide">
          <h2>{t("step1Title")}</h2>
          <div className="form-grid">
            <label>
              {t("titleLabel")}
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("titlePlaceholder")}
              />
            </label>
            <label>
              {t("toneLabel")}
              <select value={tone} onChange={(e) => setTone(e.target.value)}>
                {TONE_OPTIONS[lang].map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
            <label className="full">
              {t("originalLabel")}
              <textarea
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                rows={5}
                placeholder={t("originalPlaceholder")}
              />
            </label>
          </div>

          <div className="form-row">
            <span className="form-label">{t("targetPlatformsLabel")}</span>
            <div className="platforms">
              {ALL_PLATFORMS.map((p) => (
                <button
                  key={p}
                  type="button"
                  className={selectedPlatforms.includes(p) ? "chip active" : "chip"}
                  onClick={() => togglePlatform(p)}
                >
                  {platLabel(p)}
                </button>
              ))}
            </div>
          </div>

          <button className="primary" onClick={submitContent} disabled={loading}>
            {loading ? t("creating") : t("createBtn")}
          </button>
          <p className="hint">{t("hint")}</p>
        </section>

        {/* ② Mind 记忆 */}
        <section className="panel">
          <h2>{t("step2Title")}</h2>
          {!profile ? (
            <div className="empty">{t("loading")}</div>
          ) : (
            <>
              <div className="profile-card">
                <div className="profile-name">{profile.name}</div>
                <div className="profile-meta">
                  <span>{t("brandVoiceLabel")}</span>
                  {profile.brand_voice || t("notSet")}
                </div>
                <div className="profile-meta">
                  <span>{t("targetPlatformsLabel2")}</span>
                  <div className="chips-inline">
                    {targetPlatforms.length === 0 ? (
                      <span className="muted">{t("notSet")}</span>
                    ) : (
                      targetPlatforms.map((p) => (
                        <span key={p} className="mini-chip">{platLabel(p)}</span>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <h3>{t("rememberedPrefs")}</h3>
              <div className="stack small">
                {memory.length === 0 ? (
                  <div className="empty">{t("noMemory")}</div>
                ) : (
                  memory.map((m) => (
                    <div key={`${m.key}-${m.updated_at}`} className="mem-card">
                      <div className="mem-key">{m.key}</div>
                      <div className="mem-value">{m.value}</div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </section>

        {/* ③ 待办任务 */}
        <section className="panel">
          <h2>{t("step3Title")}</h2>
          <div className="stack small">
            {openTasks.length === 0 && <div className="empty">{t("noTasks")}</div>}
            {openTasks.map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-head">
                  <span className={`badge ${tkStatus(task.status)?.cls}`}>{tkStatus(task.status)?.label}</span>
                  <span className="task-type">{task.task_type}</span>
                </div>
                <div className="task-note">{task.note || "—"}</div>
                {task.source_id && (
                  <div className="task-meta">{t("fromLabel")}{sourceTitleMap[task.source_id] || `#${task.source_id}`}</div>
                )}
                {task.due_at && <div className="task-meta">{t("dueLabel")}{relTime(task.due_at, lang)}</div>}
                <button className="small" onClick={() => updateTaskStatus(task.id, "done")}>
                  {t("markDone")}
                </button>
              </div>
            ))}
          </div>
          {doneTasks.length > 0 && (
            <button className="collapsible-head" onClick={() => setShowDone((v) => !v)}>
              <span className="chev">{showDone ? "▾" : "▸"}</span>
              {t("doneHeader")}（{doneTasks.length}）
            </button>
          )}
          {showDone && doneTasks.length > 0 && (
            <div className="stack small">
              {doneTasks.map((task) => (
                <div key={task.id} className="task-card done">
                  <div className="task-head">
                    <span className={`badge ${tkStatus(task.status)?.cls}`}>{tkStatus(task.status)?.label}</span>
                    <span className="task-type muted">{task.task_type}</span>
                  </div>
                  <div className="task-note muted">{task.note || "—"}</div>
                  <button className="small ghost" onClick={() => updateTaskStatus(task.id, "open")}>
                    {t("resetTodo")}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ④ 原稿列表（分页 + 点击查看版本） */}
        <section className="panel wide">
          <h2>{t("step4Title")}</h2>
          <div className="stack small">
            {pagedSources.length === 0 ? (
              <div className="empty">{t("noSources")}</div>
            ) : (
              pagedSources.map((s) => (
                <div
                  key={s.id}
                  className={s.id === selectedSourceId ? "source-row selected" : "source-row"}
                  onClick={() => selectSource(s.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") selectSource(s.id);
                  }}
                >
                  <div>
                    <strong>{s.title}</strong>
                    <span className="source-type">{s.source_type}</span>
                  </div>
                  <span className="muted">{relTime(s.created_at, lang)}</span>
                </div>
              ))
            )}
          </div>
          {sources.length > PAGE_SIZE && (
            <div className="pager">
              <button
                className="small ghost"
                disabled={sourcePage <= 1}
                onClick={() => setSourcePage((p) => Math.max(1, p - 1))}
              >
                {t("prev")}
              </button>
              <span className="pager-info">{sourcePage} / {totalPages}</span>
              <button
                className="small ghost"
                disabled={sourcePage >= totalPages}
                onClick={() => setSourcePage((p) => Math.min(totalPages, p + 1))}
              >
                {t("next")}
              </button>
            </div>
          )}
        </section>

        {/* ⑤ 内容版本（来自选中原稿，截断预览） */}
        <section className="panel wide">
          <h2>{t("step5Title")}</h2>
          {selectedSourceId == null ? (
            <div className="empty">{t("selectSource")}</div>
          ) : selectedVersions.length === 0 ? (
            <div className="empty">{t("noVersions")}</div>
          ) : (
            <div className="versions">
              {selectedVersions.map((v) => {
                const expanded = expandedVersions.has(v.id);
                return (
                  <article key={v.id} className="version-card">
                    <div className="version-head">
                      <strong>{platLabel(v.platform) || v.platform}</strong>
                      <span className={`badge ${vStatus(v.status)?.cls}`}>
                        {vStatus(v.status)?.label}
                      </span>
                    </div>
                    <div className="version-meta">{t("toneSmall")} {v.tone}</div>
                    <pre className="version-text">{expanded ? v.version_text : truncate(v.version_text)}</pre>
                    {v.version_text.length > 160 && (
                      <button className="small ghost" onClick={() => toggleExpand(v.id)}>
                        {expanded ? t("collapse") : t("expand")}
                      </button>
                    )}
                    <div className="version-actions">
                      {Object.entries(VERSION_STATUS[lang]).map(([key, info]) => (
                        <button
                          key={key}
                          className={v.status === key ? "small active" : "small ghost"}
                          onClick={() => updateVersionStatus(v.id, key)}
                        >
                          {info.label}
                        </button>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
