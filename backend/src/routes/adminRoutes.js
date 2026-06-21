import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly, authorizeRoles } from "../middleware/authMiddleware.js";

import {
  getAdminSummaryDashboard,
  adminDeleteUser,
  updateUserRole,
  getSuperAdminAnalytics,
  getSystemTelemetryMetrics 
} from "../controllers/adminController.js";

import { getDashboardAnalytics } from "../controllers/analyticsController.js";
import { getAllLeads } from "../controllers/leadController.js";
import { getPlatformGlobalAuditLedger } from "../controllers/auditController.js";
import { 
  getPendingKycSubmissions, 
  reviewKycSubmission,
  submitUserKYCDocuments,
  evaluateKYCCompliance,
  submitNewKycTicket
} from "../controllers/kycController.js";

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

router.get(
  "/super-admin/analytics", 
  protect, 
  adminOnly, 
  getSuperAdminAnalytics
);

router.get(
  "/system-health",
  protect,
  adminOnly,
  getSystemTelemetryMetrics
);

router.get(
  "/audit/changelog-stream", 
  protect, 
  authorizeRoles("super_admin"), 
  getPlatformGlobalAuditLedger
);

router.get(
  "/kyc/pending",
  protect,
  adminOnly,
  getPendingKycSubmissions
);

router.put(
  "/kyc/review/:id",
  protect,
  adminOnly,
  reviewKycSubmission
);

router.post("/kyc/submit-profile", protect, submitNewKycTicket);

export default router;
