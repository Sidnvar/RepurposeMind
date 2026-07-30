import { db } from "../db.js";

export function listTasks() {
  return db.prepare("SELECT * FROM follow_up_tasks ORDER BY id DESC").all();
}

export function updateTaskStatus(taskId, status) {
  db.prepare("UPDATE follow_up_tasks SET status = ? WHERE id = ?").run(status, taskId);
  return { ok: true };
}
