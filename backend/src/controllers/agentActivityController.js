import AgentActivity from "../models/AgentActivity.js";

export const getMyActivityTimeline = async (req, res) => {
  try {
    const activities = await AgentActivity.find({
      agentId: req.user._id
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(activities);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getAgencyActivityFeed = async (req, res) => {
  try {
    const activities = await AgentActivity.find({
      agencyId: req.user.agencyId
    })
      .populate("agentId", "name email")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(activities);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};