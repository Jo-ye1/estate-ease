import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createTaskComment,
  getTaskComments
} from "../controllers/taskCommentController.js";

const router = express.Router();

router.post("/:taskId", protect, createTaskComment);
router.get("/:taskId", protect, getTaskComments);

export default router;