import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Lead from "../models/Lead.js";
import Property from "../models/Property.js";
import LeadTask from "../models/LeadTask.js";
import AgentProfile from "../models/AgentProfile.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const leadsCount = await Lead.countDocuments({
      assignedAgent: req.user._id
    });

    const closedDeals = await Lead.countDocuments({
      assignedAgent: req.user._id,
      status: "won"
    });

    const tasksPending = await LeadTask.countDocuments({
      assignedTo: req.user._id,
      status: "pending"
    });

    const tasksOverdue = await LeadTask.countDocuments({
      assignedTo: req.user._id,
      status: "overdue"
    });

    const propertiesAssigned = await Property.countDocuments({
      assignedAgent: req.user._id
    });

    const profile = await AgentProfile.findOne({
      userId: req.user._id
    });

    res.json({
      leadsCount,
      closedDeals,
      tasksPending,
      tasksOverdue,
      propertiesAssigned,
      totalRevenueGenerated: profile?.totalRevenueGenerated || 0,
      conversionRate: profile?.conversionRate || 0,
      currentWorkload: profile?.currentWorkload || 0,
      availability: profile?.availability || "available"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

export default router;
