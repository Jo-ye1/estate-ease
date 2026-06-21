import Lead from "../models/Lead.js";
import LeadTask from "../models/LeadTask.js";
import Property from "../models/Property.js";
import AgentProfile from "../models/AgentProfile.js";

export const getAgentDashboard = async (req, res) => {
  try {
    const agentProfile = await AgentProfile.findOne({
      userId: req.user._id
    });

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

    res.json({
      leadsCount,
      closedDeals,
      tasksPending,
      tasksOverdue,
      propertiesAssigned,
      totalRevenueGenerated: agentProfile?.totalRevenueGenerated || 0,
      conversionRate: agentProfile?.conversionRate || 0,
      currentWorkload: agentProfile?.currentWorkload || 0
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getMyAssignedLeads = async (req, res) => {
  try {
    const leads = await Lead.find({
      assignedAgent: req.user._id
    }).sort({ createdAt: -1 });

    res.json(leads);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getMyTasks = async (req, res) => {
  try {
    const tasks = await LeadTask.find({
      assignedTo: req.user._id
    }).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getMyAssignedProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      assignedAgent: req.user._id
    }).sort({ createdAt: -1 });

    res.json(properties);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getMyCommissions = async (req, res) => {
  try {
    const leads = await Lead.find({
      assignedAgent: req.user._id,
      status: "won"
    }).select("commissionAmount status closedAt");

    const commissions = leads.map((lead) => ({
      _id: lead._id,
      amount: lead.commissionAmount || 0,
      status: "paid",
      closedAt: lead.closedAt
    }));

    res.json(commissions);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};