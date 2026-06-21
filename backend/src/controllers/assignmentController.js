import mongoose from "mongoose";
import { createNotification } from "../utils/createNotification.js";
import { logAgentActivity } from "../utils/logAgentActivity.js";
import { getIO } from "../socket/socket.js";

export const assignPropertyToAgent = async (req, res) => {
  try {
    const { propertyId, agentId } = req.body;
    const AgencyModel = mongoose.model("Agency");
    const PropertyModel = mongoose.model("Property");
    const UserModel = mongoose.model("User");

    const agency = await AgencyModel.findOne({ ownerId: req.user._id });
    if (!agency) {
      return res.status(403).json({ message: "Forbidden: Only brokerage owners can allocate portfolio assets." });
    }

    if (agentId && !agency.agents.includes(agentId)) {
      return res.status(400).json({ message: "Conflict: Target agent does not belong to your agency roster." });
    }

    const property = await PropertyModel.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property listing asset not found." });
    }

    property.assignedAgent = agentId || null;
    property.assignedBy = req.user._id;
    property.assignedAt = agentId ? new Date() : null;
    await property.save();

    if (agentId) {
      await createNotification({
        recipient: agentId,
        type: "NEW_LEAD_RECEIVED", 
        title: "New Property Assignment",
        message: `You have been designated as the listing manager for "${property.title}".`,
        relatedId: property._id,
        relatedType: "Property"
      });

      await logAgentActivity({
        agencyId: agency._id,
        agentId,
        actionType: "property_assigned",
        title: "Property Assigned",
        description: `Assigned property "${property.title}"`,
        relatedId: property._id,
        relatedType: "Property",
        metadata: {
          assignedBy: req.user._id
        }
      });
    }

    try {
      const io = getIO();
      if (io) io.emit("pipeline:update");
    } catch (socketErr) {
      console.error("Socket broadcast skipped:", socketErr.message);
    }

    res.json({ success: true, message: "Listing assignment matrix updated cleanly.", property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const assignLeadToAgent = async (req, res) => {
  try {
    const { leadId, agentId } = req.body;
    const AgencyModel = mongoose.model("Agency");
    const LeadModel = mongoose.model("Lead");

    const agency = await AgencyModel.findOne({ ownerId: req.user._id });
    if (!agency) {
      return res.status(403).json({ message: "Forbidden: Only agency owners can delegate CRM client leads." });
    }

    if (agentId && !agency.agents.includes(agentId)) {
      return res.status(400).json({ message: "Conflict: Selected team worker is outside your agency roster." });
    }

    const lead = await LeadModel.findById(leadId);
    if (!lead) {
      return res.status(404).json({ message: "CRM customer lead file not found." });
    }

    lead.assignedAgent = agentId || null;
    lead.assignedBy = req.user._id;
    lead.assignedAt = agentId ? new Date() : null;
    await lead.save();

    if (agentId) {
      await createNotification({
        recipient: agentId,
        type: "NEW_LEAD_RECEIVED",
        title: "New Client Lead Delegated",
        message: "A marketplace inquiry file has been transferred into your workspace pipeline tracker.",
        relatedId: lead._id,
        relatedType: "Lead"
      });

      await logAgentActivity({
        agencyId: agency._id,
        agentId,
        actionType: "lead_assigned",
        title: "Lead Assigned",
        description: `A new client lead has been delegated`,
        relatedId: lead._id,
        relatedType: "Lead",
        metadata: {
          assignedBy: req.user._id
        }
      });
    }

    try {
      const io = getIO();
      if (io) io.emit("pipeline:update");
    } catch (socketErr) {
      console.error("Socket broadcast skipped:", socketErr.message);
    }

    res.json({ success: true, message: "CRM pipeline lead assigned smoothly.", lead });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
