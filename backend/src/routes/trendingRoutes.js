import express from "express";
import {
  getTrendingProperties,
} from "../controllers/trendingController.js";

const router = express.Router();

router.get("/", getTrendingProperties);

export default router;