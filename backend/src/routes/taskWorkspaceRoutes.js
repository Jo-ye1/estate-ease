import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMyWorkspaceTasks,
  getAgencyWorkspaceTasks,
  getTaskAnalytics
} from "../controllers/taskWorkspaceController.js";

const router = express.Router();

router.get("/my", protect, getMyWorkspaceTasks);
router.get("/agency", protect, getAgencyWorkspaceTasks);
router.get("/analytics", protect, getTaskAnalytics);

export default router;