import mongoose from "mongoose";

const enforcePermissionScope = async (req, matchQuery) => {
  const role = String(req.user?.role).toLowerCase();
  
  if (role === "super_admin" || role === "admin") {
    return;
  }
  
  if (role === "agency") {
    const AgencyModel = mongoose.model("Agency");
    const agency = await AgencyModel.findOne({ ownerId: req.user._id });
    if (!agency) {
      matchQuery._id = null; 
      return;
    }
    matchQuery.$or = [
      { owner: req.user._id },
      { assignedAgent: { $in: agency.agents } },
      { owner: { $in: agency.agents } }
    ];
    return;
  }
  
  if (role === "agent") {
    matchQuery.assignedAgent = req.user._id;
    return;
  }
  
  if (role === "seller") {
    req.isReadOnlyRequest = true;
    return;
  }

  matchQuery._id = null;
};

export const executeBulkLeadActions = async (req, res) => {
  try {
    const { leadIds, actionType, payload } = req.body;

    if (!Array.isArray(leadIds) || leadIds.length === 0) {
      return res.status(400).json({ message: "Invalid payload parameters: leadIds collection cannot be empty." });
    }

    if (String(req.user?.role).toLowerCase() === "seller" || req.isReadOnlyRequest) {
      return res.status(403).json({ message: "Forbidden: Sellers hold read-only operational desk context limits." });
    }

    const LeadModel = mongoose.model("Lead");
    const updateQuery = {};
    const matchQuery = { _id: { $in: leadIds.map(id => new mongoose.Types.ObjectId(id)) } };

    await enforcePermissionScope(req, matchQuery);

    if (actionType === "assign_agent") {
      if (String(req.user?.role).toLowerCase() === "agent") {
        return res.status(403).json({ message: "Forbidden: Agents lack proxy load-balancing delegation clearance." });
      }
      updateQuery.assignedAgent = payload.agentId ? new mongoose.Types.ObjectId(payload.agentId) : null;
      updateQuery.assignedBy = req.user._id;
      updateQuery.assignedAt = new Date();
    } else if (actionType === "move_stage") {
      updateQuery.pipelineStage = payload.stage;
      updateQuery.lastStageUpdatedAt = new Date();
    } else if (actionType === "archive") {
      updateQuery.status = "archived";
    } else if (actionType === "add_tags") {
      updateQuery.$addToSet = { tags: { $each: payload.tags } };
    } else if (actionType === "delete") {
      if (!["agency", "admin", "super_admin"].includes(String(req.user?.role).toLowerCase())) {
        return res.status(403).json({ message: "Forbidden: Destructive actions require management level clearances." });
      }
      await LeadModel.deleteMany(matchQuery);
      const io = mongoose.connection.models.Lead ? req.app?.get("io") : null;
      if (io) io.emit("pipeline:update");
      return res.json({ success: true, message: `Successfully executed batch purge request on designated records.` });
    } else {
      return res.status(400).json({ message: "Unsupported configuration action signature blueprint tracking flags." });
    }

    if (updateQuery.$addToSet) {
      await LeadModel.updateMany(matchQuery, { $addToSet: updateQuery.$addToSet });
    } else {
      await LeadModel.updateMany(matchQuery, { $set: updateQuery });
    }

    res.json({ success: true, message: "Batch transaction pipeline sequence committed successfully across matching files." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
