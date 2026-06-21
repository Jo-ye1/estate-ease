import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  generateCommissionLedger,
  getAllCommissions,
  getSingleCommission,
  markCommissionPaid,
  getMyAgentCommissions,
  getMyAgencyCommissions
} from "../controllers/commissionController.js";

const router = express.Router();

router.post("/generate/:dealId", protect, generateCommissionLedger);

router.get("/", protect, getAllCommissions);

router.get("/agent/me", protect, getMyAgentCommissions);

router.get("/agency/me", protect, getMyAgencyCommissions);

router.get("/:id", protect, getSingleCommission);

router.put("/:id/pay", protect, markCommissionPaid);

export default router;