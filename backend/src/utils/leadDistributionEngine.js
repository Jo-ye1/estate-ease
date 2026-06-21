import mongoose from "mongoose";
import { createNotification } from "./createNotification.js";
import { getIO } from "../socket/socket.js";

export const assignLeadViaRoundRobin = async (leadId, agencyId) => {
  try {
    const AgencyModel = mongoose.model("Agency");
    const LeadModel = mongoose.model("Lead");
    const UserModel = mongoose.model("User");

    const agency = await AgencyModel.findById(agencyId);
    if (!agency || !agency.agents || agency.agents.length === 0) return null;

    const availableAgents = [];
    for (const agentId of agency.agents) {
      const profile = await UserModel.findById(agentId).select("availabilityStatus");
      if (profile && (profile.availabilityStatus === "available" || profile.availabilityStatus === "online")) {
        availableAgents.push(agentId);
      }
    }

    // 🟢 FIXED POOL SELECTOR: Corrected array variable assignment placeholder
    const selectionPool = availableAgents.length > 0 ? availableAgents : agency.agents;

    let selectedAgent = selectionPool[0];
    let minLoad = Infinity;

    for (const agentId of selectionPool) {
      const activeLeadsCount = await LeadModel.countDocuments({
        assignedAgent: agentId,
        pipelineStage: { $nin: ["closed", "lost", "closed won"] }
      });
      
      // 🟢 FIXED TRACKER LOGIC: Accurately identifies the agent with the lowest document profile count load
      if (activeLeadsCount < minLoad) {
        minLoad = activeLeadsCount;
        selectedAgent = agentId;
      }
    }

    const lead = await LeadModel.findById(leadId);
    if (lead) {
      lead.assignedAgent = selectedAgent;
      lead.assignedBy = agency.ownerId;
      lead.assignedAt = new Date();
      await lead.save();

      // Appends timeline stream history safely inside your Profile database records
      try {
        const ProfileModel = mongoose.model("Profile") || mongoose.model("UserProfile");
        const agentProfile = await ProfileModel.findOne({ user: selectedAgent });
        if (agentProfile && Array.isArray(agentProfile.activityTimeline)) {
          agentProfile.activityTimeline.push({
            actionType: "lead_assigned",
            description: `Automatically routed new multi-channel customer lead: ${lead.name}`
          });
          await agentProfile.save();
        }
      } catch (e) {}

      // Generates internal SaaS alert updates notices
      try {
        await createNotification({
          recipient: selectedAgent,
          type: "NEW_LEAD_RECEIVED",
          title: "Automated Workload Allocation",
          message: `A new client lead (${lead.name}) has been automatically routed to your workspace.`,
          relatedId: lead._id,
          relatedType: "Lead"
        });
      } catch (notifErr) {
        console.warn("Notification engine bypass:", notifErr.message);
      }

      // Triggers asynchronous WebSockets updates pushes
      try {
        const io = getIO();
        if (io) io.emit("pipeline:update");
      } catch (e) {}
    }

    return selectedAgent;
  } catch (error) {
    console.error("Automated load allocation engine failure:", error.message);
    return null;
  }
};
