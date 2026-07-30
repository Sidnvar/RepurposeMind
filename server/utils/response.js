export function success(res, data = null, message = "ok") {
  return res.json({ success: true, message, data });
}

export function fail(res, message = "error", status = 400) {
  return res.status(status).json({ success: false, message });
}
