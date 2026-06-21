import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getPipelineReport,
  getCommissionDashboard,
  getAgencyHealthScore,
  getForecastEngine
} from "../controllers/reportController.js";

const router = express.Router();

router.get("/pipeline", protect, getPipelineReport);
router.get("/commission", protect, getCommissionDashboard);
router.get("/health", protect, getAgencyHealthScore);
router.get("/forecast", protect, getForecastEngine);

export default router;