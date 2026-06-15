import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getFavorites,
  toggleFavorite,
} from "../controllers/favoriteController.js";

const router = express.Router();

router.get("/", protect, getFavorites);
router.post("/toggle/:propertyId", protect, toggleFavorite);

export default router;
