import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getConversations,
  getMessages,
  sendMessage,
  markMessagesRead,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/", protect, getConversations);

router.get(
  "/:id/messages",
  protect,
  getMessages
);

router.post(
  "/:id/messages",
  protect,
  sendMessage
);

router.put(
  "/:id/read",
  protect,
  markMessagesRead
);

export default router;