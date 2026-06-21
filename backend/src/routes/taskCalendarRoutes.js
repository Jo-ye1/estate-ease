import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getTaskCalendar } from "../controllers/taskCalendarController.js";

const router = express.Router();

router.get("/", protect, getTaskCalendar);

export default router;