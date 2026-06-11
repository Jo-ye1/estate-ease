import express from "express";
import { getAdminSummaryDashboard, adminDeleteUser } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/authMiddleware.js"; // 👈 Enforce strict dual-guard check
import { getAdminSummaryDashboard, adminDeleteUser, updateUserRole } 

const router = express.Router();

// Mount dual middleware layers: user must be logged-in AND verified as an active admin role
router.get("/dashboard-summary", protect, admin, getAdminSummaryDashboard);
router.put("/users/:id/role", protect, admin, updateUserRole);
router.delete("/users/:id", protect, admin, adminDeleteUser);

export default router;
