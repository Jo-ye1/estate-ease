import express from "express";
import { subscribe } from "../controllers/newsletterController.js";

const router = express.Router();

// Publicly accessible entry route mapping
router.post("/subscribe", subscribe);

export default router;
