import express from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validationMiddleware.js";
import {
  getProperties,
  getMyProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  createProperty,
  uploadPropertyImage,
  getRelatedProperties,
  getStats,
  updatePropertyStatus,
  submitPropertyForReview, 
  approveProperty,         
  rejectProperty          
} from "../controllers/propertyController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js"; 
import { enforcePropertyLimit } from "../middleware/planGuard.js";
import upload from "../middleware/uploadMiddleware.js";
import { createLead } from "../controllers/leadController.js";

const router = express.Router();

router.get("/", getProperties);
router.get("/stats", getStats);
router.get("/my-properties", protect, getMyProperties);
router.get("/:id", getPropertyById);
router.get("/:id/related", getRelatedProperties);
router.post("/:id/contact", protect, createLead);

router.post(
  "/", 
  protect, 
  enforcePropertyLimit,
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
router.delete("/:id", protect, deleteProperty);

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

export default router;
