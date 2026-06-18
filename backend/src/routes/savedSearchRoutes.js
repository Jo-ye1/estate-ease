import express from "express";
import {
  createSavedSearch,
  getMySavedSearches,
  deleteSavedSearch,
} from "../controllers/savedSearchController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createSavedSearch);
router.get("/", protect, getMySavedSearches);
router.delete("/:id", protect, deleteSavedSearch);

export default router;