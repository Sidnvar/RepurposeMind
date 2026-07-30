import { listTasks, updateTaskStatus } from "../services/task.service.js";
import { success, fail } from "../utils/response.js";

export function handleListTasks(_, res) {
  return success(res, { tasks: listTasks() });
}

export function handleUpdateTaskStatus(req, res) {
  const taskId = Number(req.params.id);
  const { status } = req.body;

  if (!status) {
    return fail(res, "status is required", 400);
  }

  const data = updateTaskStatus(taskId, status);
  return success(res, data, "task updated");
}
