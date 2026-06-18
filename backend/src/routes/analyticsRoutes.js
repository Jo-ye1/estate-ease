import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

import {
  getDashboardAnalytics,
  getOwnerAnalytics,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  adminOnly,
  getDashboardAnalytics
);

router.get(
  "/owner",
  protect,
  getOwnerAnalytics
);

export default router;