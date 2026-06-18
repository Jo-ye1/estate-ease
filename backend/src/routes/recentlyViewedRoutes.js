import express from "express";
import {
  trackRecentlyViewed,
  getRecentlyViewed,
} from "../controllers/recentlyViewedController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, trackRecentlyViewed);

router.get("/", protect, getRecentlyViewed);

export default router;