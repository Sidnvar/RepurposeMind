// LLM 调用封装：OpenAI 兼容的 /v1/chat/completions 端点
// 支持 OpenAI / DeepSeek / Kimi(Moonshot) / 通义千问 / 本地 Ollama，只需换 baseUrl
import { config } from "./config.js";

export function isLLMEnabled() {
  return Boolean(config.llm.apiKey && config.llm.apiKey.trim());
}

// 每个平台输出长度不同，给不同的 max_tokens 上限
const PER_PLATFORM_MAX_TOKENS = {
  x: 200,
  tiktok: 400,
  youtube: 700,
  xiaohongshu: 600,
  newsletter: 1200,
};

export async function callLLM({ system, user, platform, signal }) {
  const { apiKey, baseUrl, model, temperature } = config.llm;
  const maxTokens = PER_PLATFORM_MAX_TOKENS[platform] ?? 800;

  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`LLM HTTP ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("LLM 返回内容为空");
  return content;
}
