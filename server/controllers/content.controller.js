import { createContentSource, createRepurposedVersions, listContent, updateVersionStatus, getVersionsBySource } from "../services/content.service.js";
import { success, fail } from "../utils/response.js";

export function handleListContent(_, res) {
  return success(res, listContent());
}

export function handleCreateContent(req, res) {
  const { title, originalText, sourceType } = req.body;
  const userId = 1;

  if (!title || !originalText) {
    return fail(res, "title and originalText are required", 400);
  }

  const data = createContentSource({ userId, title, originalText, sourceType });
  return success(res, data, "content created");
}

export async function handleRepurposeContent(req, res) {
  const sourceId = Number(req.params.id);
  const { platforms = [], tone = "neutral", context, learn, lang = "zh-CN" } = req.body;

  if (!platforms.length) {
    return fail(res, "platforms is required", 400);
  }

  try {
    const data = await createRepurposedVersions({
      sourceId,
      platforms,
      tone,
      context,
      learn: learn !== false,
      lang,
    });
    if (!data) {
      return fail(res, "content source not found", 404);
    }
    return success(res, data, "versions created");
  } catch (e) {
    return fail(res, e.message || "生成失败", 500);
  }
}

export function handleUpdateVersionStatus(req, res) {
  const versionId = Number(req.params.id);
  const { status } = req.body;

  if (!status) {
    return fail(res, "status is required", 400);
  }

  const data = updateVersionStatus(versionId, status);
  return success(res, data, "version updated");
}

export function handleGetVersionsBySource(req, res) {
  const sourceId = Number(req.params.id);
  const versions = getVersionsBySource(sourceId);
  return success(res, { sourceId, versions }, "versions fetched");
}
