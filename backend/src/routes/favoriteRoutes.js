import express from "express";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../controllers/favoriteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Fetch all favorites for the logged-in user
router.get("/", protect, getFavorites);

// Add a property to favorites (Matches req.params.propertyId in controller)
router.post("/:propertyId", protect, addFavorite);

// Remove a property from favorites (Matches req.params.propertyId in controller)
router.delete("/:propertyId", protect, removeFavorite);

export default router;
