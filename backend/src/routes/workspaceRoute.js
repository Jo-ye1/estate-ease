import mongoose from "mongoose";

export const assignLeadToAgent = async (req, res) => {
  try {
    const { leadId, agentId, priority } = req.body;

    if (!leadId || !agentId) {
      return res.status(400).json({ 
        error: "Missing leadId or agentId parameters" 
      });
    }

    const LeadModel = mongoose.model("Lead");
    const AgentActivityModel = mongoose.model("AgentActivity");

    const updatedLead = await LeadModel.findByIdAndUpdate(
      leadId,
      {
        agentId: agentId,
        stage: "ASSIGNED",
        priority: priority || "MEDIUM"
      },
      { new: true }
    );

    if (!updatedLead) {
      return res.status(404).json({ 
        error: "Target Lead document not found" 
      });
    }

    await AgentActivityModel.create({
      leadId: leadId,
      agentId: agentId,
      actorId: req.user?._id || "AGENCY_MANAGER",
      title: "Manual Operational Assignment",
      description: `Lead assigned to agent with a ${priority || "MEDIUM"} operational priority tracking profile.`,
      eventIcon: "cpu"
    });

    res.json({ success: true, data: updatedLead });
  } catch (error) {
    console.error("Assignment Error:", error);
    res.status(500).json({ 
      error: "Internal Server Error Database Mutation Failure" 
    });
  }
};
