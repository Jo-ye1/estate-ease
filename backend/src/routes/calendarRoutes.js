import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireCapability } from "../middleware/permissionMiddleware.js";

import {
  createCalendarEvent,
  getMyCalendarEvents,
  getAgencyCalendarEvents,
  getSingleCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent
} from "../controllers/calendarController.js";

const router = express.Router();

router.post(
  "/",
  protect,
  requireCapability("can_assign_tasks"),
  createCalendarEvent
);

router.get(
  "/my",
  protect,
  getMyCalendarEvents
);

router.get(
  "/agency",
  protect,
  requireCapability("can_assign_tasks"),
  getAgencyCalendarEvents
);

router.get(
  "/:id",
  protect,
  getSingleCalendarEvent
);

router.put(
  "/:id",
  protect,
  updateCalendarEvent
);

router.delete(
  "/:id",
  protect,
  deleteCalendarEvent
);

export default router;