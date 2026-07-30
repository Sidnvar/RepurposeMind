import { getProfile } from "../services/profile.service.js";
import { success } from "../utils/response.js";

export function handleGetProfile(req, res) {
  const lang = req.query.lang || "zh-CN";
  const data = getProfile(lang);
  return success(res, data);
}
