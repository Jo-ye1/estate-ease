import mongoose from "mongoose";

export const computeAgentPerformanceRankings = async (req, res) => {
  try {
    const UserModel = mongoose.model("User");
    const LeadModel = mongoose.model("Lead");

    const agents = await UserModel.find({ role: "agent" });

    const updatedAgents = [];

    for (const agent of agents) {
      const totalLeads = await LeadModel.countDocuments({ assignedAgent: agent._id });
      const wonLeads = await LeadModel.countDocuments({ assignedAgent: agent._id, status: "won" });

      const conversionRate = totalLeads === 0 ? 0 : (wonLeads / totalLeads) * 100;
      
      const speedScore = Math.max(0, 100 - (agent.responseTimeMinutes || 15));
      const reviewWeight = (agent.reviewScore || 5.0) * 20; 
      const closureWeight = Math.min(100, (agent.dealCount || 0) * 10); 
      
      const calculatedScore = Math.round(
        (conversionRate * 0.4) + 
        (reviewWeight * 0.3) + 
        (closureWeight * 0.2) + 
        (speedScore * 0.1)
      );

      agent.performanceScore = Math.min(100, Math.max(0, calculatedScore));

      let badgeTier = "none";
      if (agent.performanceScore >= 90) badgeTier = "platinum";
      else if (agent.performanceScore >= 75) badgeTier = "gold";
      else if (agent.performanceScore >= 60) badgeTier = "silver";
      else if (agent.performanceScore >= 40) badgeTier = "bronze";

      agent.trustBadge = badgeTier;
      await agent.save();

      updatedAgents.push({
        id: agent._id,
        name: agent.name,
        score: agent.performanceScore,
        badge: agent.trustBadge,
        stats: {
          dealsClosed: agent.dealCount,
          rating: agent.reviewScore,
          conversion: `${Math.round(conversionRate)}%`
        }
      });
    }

    updatedAgents.sort((a, b) => b.score - a.score);

    res.json({
      success: true,
      message: "Brokerage performance scoring matrix recalculation executed successfully.",
      rankings: updatedAgents
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
