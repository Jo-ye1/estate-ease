import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getOwnerDashboard } from "../controllers/dashboardController.js";

// 🟢 STEP 1 INTEGRATION: Import your subscription feature gate middleware
import { requireFeature } from "../middleware/featureGate.js";

const router = express.Router();

// 🟢 STEP 1 MOUNTED: Added the feature guard to lock owner dashboards down to premium plan tiers
router.get(
  "/", 
  protect, 
  requireFeature("analyticsAccess"), // Blocks free tier users dynamically via MongoDB checks
  getOwnerDashboard
);

export default router;
