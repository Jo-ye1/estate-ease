import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getLeadTasks,
  createLeadTask,
  updateLeadTask,
  deleteLeadTask
} from "../controllers/leadTaskController.js";

const router = express.Router();

router.get("/leads/:id/tasks", protect, getLeadTasks);
router.post("/leads/:id/tasks", protect, createLeadTask);
router.put("/tasks/:id", protect, updateLeadTask);
router.delete("/tasks/:id", protect, deleteLeadTask);

export default router;
