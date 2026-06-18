import express from "express";
import {
  getRecommendedProperties,
} from "../controllers/recommendationController.js";

const router = express.Router();

router.get(
  "/:id",
  getRecommendedProperties
);

export default router;