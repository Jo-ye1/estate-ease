import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getPipeline,
  moveLeadStage
} from "../controllers/pipelineController.js";

const router = express.Router();

router.get("/", protect, getPipeline);

router.put(
  "/:id/move",
  protect,
  moveLeadStage
);

export default router;