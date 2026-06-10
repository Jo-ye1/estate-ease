import express from "express";
import {
  getProperties,
  getMyProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  createProperty,
  uploadPropertyImage,
  getRelatedProperties,
  getStats
} from "../controllers/propertyController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Publicly accessible property display endpoints
router.get("/", getProperties);
router.get("/stats", getStats); // 👈 Positioned above dynamic parameter paths safely

router.get("/my-properties", protect, getMyProperties);
router.get("/:id", getPropertyById);
router.get("/:id/related", getRelatedProperties);

// Protected endpoints requiring a valid login token header
router.post("/", protect, createProperty);
router.put("/:id", protect, updateProperty);
router.delete("/:id", protect, deleteProperty);

// Image uploading endpoint with inline error intercept tracking
router.post(
  "/:id/upload",
  protect,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        console.error("🚨 DETAILED BACKEND FILE UPLOAD CRASH:", err);
        return res.status(400).json({ 
          message: `Upload engine failed: ${err.message}` 
        });
      }
      next();
    });
  },
  uploadPropertyImage
);

export default router;
