import { Router } from "express";
import { handleListTasks, handleUpdateTaskStatus } from "../controllers/task.controller.js";

const router = Router();

router.get("/tasks", handleListTasks);
router.patch("/tasks/:id/status", handleUpdateTaskStatus);

export default router;
