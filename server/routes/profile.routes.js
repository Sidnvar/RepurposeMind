import { Router } from "express";
import { handleGetProfile } from "../controllers/profile.controller.js";

const router = Router();

router.get("/profile", handleGetProfile);

export default router;
