import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMyBilling,
  processSuccessfulPayment,
  createCheckoutSession,
} from "../controllers/billingController.js";

const router = express.Router();

router.get(
  "/me",
  protect,
  getMyBilling
);

router.post(
  "/checkout",
  protect,
  createCheckoutSession
);

router.post(
  "/webhook/success",
  protect,
  processSuccessfulPayment
);

export default router;
