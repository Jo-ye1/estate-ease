import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getAgentDashboard,
  getMyAssignedLeads,
  getMyTasks,
  getMyAssignedProperties,
  getMyCommissions
} from "../controllers/agentController.js";

const router = express.Router();

router.get("/", protect, getAgentDashboard);
router.get("/leads", protect, getMyAssignedLeads);
router.get("/tasks", protect, getMyTasks);
router.get("/properties", protect, getMyAssignedProperties);
router.get("/commissions", protect, getMyCommissions);

export default router;