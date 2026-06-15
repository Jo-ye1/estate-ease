import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

import {
  getAdminSummaryDashboard,
  adminDeleteUser,
  updateUserRole,
} from "../controllers/adminController.js";

import { getDashboardAnalytics } from "../controllers/analyticsController.js";
import { getAllLeads } from "../controllers/leadController.js";

const router = express.Router();

router.get(
  "/dashboard-summary",
  protect,
  adminOnly,
  getAdminSummaryDashboard
);

router.delete(
  "/users/:id",
  protect,
  adminOnly,
  adminDeleteUser
);

router.put(
  "/users/:id/role",
  protect,
  adminOnly,
  updateUserRole
);

router.get(
  "/dashboard",
  protect,
  adminOnly,
  getDashboardAnalytics
);

router.get(
  "/leads",
  protect,
  adminOnly,
  getAllLeads
);

export default router;