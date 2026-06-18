import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getAllLeads,
  getMyLeads,
  getMySentLeads,
  updateLeadPipeline,
  getLeadResponseMetrics,
} from "../controllers/leadController.js";

const router = express.Router();

router.get("/owner", protect, getMyLeads);
router.get("/sent", protect, getMySentLeads);

router.get("/", protect, getAllLeads);
router.put("/:id", protect, updateLeadPipeline);

router.put(
  "/:id/pipeline",
  protect,
  updateLeadPipeline
);

router.get(
  "/response-metrics",
  protect,
  getLeadResponseMetrics
);

export default router;
