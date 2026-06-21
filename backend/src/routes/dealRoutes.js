import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createDeal,
  getDeals,
  getSingleDeal,
  updateDealStatus,
  deleteDeal
} from "../controllers/dealController.js";

const router = express.Router();

router.post("/", protect, createDeal);
router.get("/", protect, getDeals);
router.get("/:id", protect, getSingleDeal);
router.put("/:id/status", protect, updateDealStatus);
router.delete("/:id", protect, deleteDeal);

export default router;