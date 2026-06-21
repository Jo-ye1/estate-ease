import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMyActivityTimeline,
  getAgencyActivityFeed
} from "../controllers/agentActivityController.js";

const router = express.Router();

router.get("/me", protect, getMyActivityTimeline);
router.get("/agency", protect, getAgencyActivityFeed);

export default router;