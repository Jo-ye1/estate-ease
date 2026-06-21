import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireCapability } from "../middleware/permissionMiddleware.js";
import {
  getAgencyProperties,
  assignPropertyToAgent
} from "../controllers/propertyManagementController.js";

const router = express.Router();

router.get("/", protect, requireCapability("can_assign_leads"), getAgencyProperties);
router.put("/:id/assign", protect, requireCapability("can_assign_leads"), assignPropertyToAgent);

export default router;
