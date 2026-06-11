import express from "express";
import { getAllTestimonials, createTestimonial } from "../controllers/testimonialController.js";
import { protect } from "../middleware/authMiddleware.js"; // Protects the creation endpoint

const router = express.Router();

// Publicly accessible homepage feed endpoint
router.get("/", getAllTestimonials);

// Secure endpoint requiring users to be logged in to leave real feedback reviews
router.post("/", protect, createTestimonial);

export default router;
