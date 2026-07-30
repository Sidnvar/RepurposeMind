import { Router } from "express";
import {
  handleCreateContent,
  handleListContent,
  handleRepurposeContent,
  handleUpdateVersionStatus,
  handleGetVersionsBySource
} from "../controllers/content.controller.js";

const router = Router();

router.get("/content", handleListContent);
router.post("/content", handleCreateContent);
router.post("/content/:id/repurpose", handleRepurposeContent);
router.get("/content/:id/versions", handleGetVersionsBySource);
router.patch("/versions/:id/status", handleUpdateVersionStatus);

export default router;
