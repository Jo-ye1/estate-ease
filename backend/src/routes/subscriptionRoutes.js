import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  getPlans,
  subscribeToPlan,
  createCheckoutSession,
  getMySubscription,
  getPlanCapabilities,
  upgradePlan,
  cancelSubscription,
  getAllSubscriptions,
} from "../controllers/subscriptionController.js";

const router = express.Router();

router.get("/plans", getPlans);
router.post("/subscribe", protect, subscribeToPlan);
router.post("/checkout", protect, createCheckoutSession);
router.get("/my", protect, getMySubscription);
router.get("/capabilities", protect, getPlanCapabilities);
router.put("/upgrade", protect, upgradePlan);
router.patch("/cancel", protect, cancelSubscription);
router.get("/admin/all", protect, adminOnly, getAllSubscriptions);

export default router;
