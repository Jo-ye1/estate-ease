import express from "express";
import {
  getMyNotifications,
  markNotificationRead,
  getUnreadCount,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyNotifications);

router.put("/:id/read", protect, markNotificationRead);

router.get("/unread-count", protect, getUnreadCount);

export default router;