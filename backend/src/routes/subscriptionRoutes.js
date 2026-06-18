import express from "express";
import {
  getMySubscription,
  upgradePlan,
  getPlanCapabilities,
} from "../controllers/subscriptionController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMySubscription);

router.get("/capabilities", protect, getPlanCapabilities);

router.put("/upgrade", protect, upgradePlan);

export default router;