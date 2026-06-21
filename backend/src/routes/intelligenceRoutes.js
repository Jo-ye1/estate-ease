import express from "express";
import {
  getSearchHeatmap,
  getDemandTrends,
  getBehaviorAnalytics,
  getMarketIntelligence,
  getPriceSuggestion,
} from "../controllers/intelligenceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/search-heatmap",
  protect,
  getSearchHeatmap
);

router.get(
  "/demand-trends",
  protect,
  getDemandTrends
);

router.get(
  "/behavior",
  protect,
  getBehaviorAnalytics
);

router.get(
  "/market",
  protect,
  getMarketIntelligence
);

router.post(
  "/price-suggestion",
  protect,
  getPriceSuggestion
);

export default router;
