import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireCapability } from "../middleware/permissionMiddleware.js";
import {
  getAgencyLeads,
  assignLeadToAgent,
  updateLeadStatus
} from "../controllers/leadManagementController.js";

const router = express.Router();

router.get("/", protect, requireCapability("can_assign_leads"), getAgencyLeads);
router.put("/:id/assign", protect, requireCapability("can_assign_leads"), assignLeadToAgent);
router.put("/:id/status", protect, requireCapability("can_assign_leads"), updateLeadStatus);

export default router;
