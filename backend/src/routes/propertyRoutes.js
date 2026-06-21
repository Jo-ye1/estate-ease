import express from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validationMiddleware.js";
import {
  getProperties,
  getMyProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  restoreProperty,
  createProperty,
  uploadPropertyImage,
  getRelatedProperties,
  getStats,
  updatePropertyStatus,
  submitPropertyForReview, 
  approveProperty,         
  rejectProperty,
  getAdminGlobalProperties,
  uploadKycDocumentAsset,
} from "../controllers/propertyController.js";
import {
  renewPropertyListing,
  getPropertySLAMetrics
} from "../controllers/lifecycleController.js";
import { protect, adminOnly, authorizeRoles } from "../middleware/authMiddleware.js"; 
import upload from "../middleware/uploadMiddleware.js";
import { createLead } from "../controllers/leadController.js";
import { checkListingLimit } from "../middleware/featureGate.js";
import { getSmartAIRecommendations } from "../controllers/recommendationController.js";
import { getSellerPerformanceSummary } from "../controllers/performanceController.js";
import { requireCapability } from "../middleware/permissionMiddleware.js";
import { verifyListingDuplicateFilter, enforceLeadAntiSpamGuard } from "../middleware/fraudGuard.js";
import { compileLegalDocumentSnapshot } from "../controllers/legalController.js";

const router = express.Router();

router.get("/", getProperties);
router.get("/stats", getStats);
router.get("/my-properties", protect, getMyProperties);
router.get("/my-properties", protect, getMyProperties);
router.get("/:id", getPropertyById);
router.get("/:id/related", getRelatedProperties);
router.post("/:id/contact", protect, enforceLeadAntiSpamGuard, createLead);

router.post(
  "/", 
  protect, 
  authorizeRoles("seller", "agent", "agency", "admin", "super_admin"),
  verifyListingDuplicateFilter,
  checkListingLimit, 
  [
    body("title").notEmpty(),
    body("description").notEmpty(),
    body("listingType").notEmpty(),
    body("location").notEmpty(),
  ],
  validate,
  createProperty
);

router.put("/:id", protect, updateProperty);
router.put("/:id/delete", protect, deleteProperty);
router.put("/:id/restore", protect, adminOnly, restoreProperty);

router.put(
  "/:id/status",
  protect,
  updatePropertyStatus
);

router.post(
  "/:id/upload",
  protect,
  upload.array("images", 10), 
  uploadPropertyImage
);

router.put(
  "/:id/submit",
  protect,
  submitPropertyForReview
);

router.put(
  "/:id/approve",
  protect,
  adminOnly,
  approveProperty
);

router.put(
  "/:id/reject",
  protect,
  adminOnly,
  rejectProperty
);

router.post(
  "/upload-doc",
  protect,
  upload.single("file"), 
  uploadKycDocumentAsset
);

router.get("/admin/all-listings", protect, adminOnly, getAdminGlobalProperties);
router.put("/:id/renew", protect, renewPropertyListing);
router.get("/:id/sla-metrics", protect, getPropertySLAMetrics);
router.get("/intelligence/predictions-feed", protect, getSmartAIRecommendations);
router.get("/seller/performance-insights", protect, getSellerPerformanceSummary);
router.put("/:id", protect, requireCapability("can_edit_listing"), updateProperty);
router.post("/agreements/generate-contract", protect, compileLegalDocumentSnapshot);

export default router;
