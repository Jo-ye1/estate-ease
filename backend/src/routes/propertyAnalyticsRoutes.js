import express from "express";
import PropertyAnalytics from "../models/PropertyAnalytics.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const analytics =
        await PropertyAnalytics.findOne({
          property: req.params.id,
        });

      res.json(analytics);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

export default router;