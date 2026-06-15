import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getAllLeads,
  updateLeadStatus,
  getMyLeads,
  getMySentLeads
} from "../controllers/leadController.js";

const router = express.Router();

router.get("/", protect, getAllLeads);
router.put("/:id", protect, updateLeadStatus);
router.get("/owner", protect, getMyLeads);
router.get("/sent", protect, getMySentLeads);

export default router;
