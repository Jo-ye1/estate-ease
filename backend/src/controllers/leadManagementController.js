import mongoose from "mongoose";

export const getAgencyLeads = async (req, res) => {
  try {
    const AgencyModel = mongoose.model("Agency");
    const LeadModel = mongoose.model("Lead");

    const agency = await AgencyModel.findOne({ ownerId: req.user._id });
    if (!agency) {
      return res.status(404).json({ message: "Agency brokerage profile not found." });
    }

    const { status, priority, agentId } = req.query;
    const filter = {
      $or: [
        { owner: req.user._id },
        { owner: { $in: agency.agents } }
      ]
    };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (agentId) filter.owner = agentId;

    const leads = await LeadModel.find(filter)
      .populate("property", "title location pricing listingType")
      .populate("buyer", "name email")
      .populate("owner", "name email role")
      .sort({ createdAt: -1 });

    res.json({ success: true, leads });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const assignLeadToAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const { agentId, priority } = req.body;

    const AgencyModel = mongoose.model("Agency");
    const LeadModel = mongoose.model("Lead");
    const UserModel = mongoose.model("User");

    const agency = await AgencyModel.findOne({ ownerId: req.user._id });
    if (!agency) {
      return res.status(403).json({ message: "Forbidden: Management authorization token validation failed." });
    }

    if (!agency.agents.includes(agentId) && agentId !== req.user._id.toString()) {
      return res.status(400).json({ message: "Target user is not registered in this agency roster matrix." });
    }

    const lead = await LeadModel.findById(id);
    if (!lead) {
      return res.status(404).json({ message: "Target lead document not found." });
    }

    lead.owner = agentId;
    if (priority) lead.priority = priority;
    await lead.save();

    res.json({ success: true, message: "Lead assignment dispatched successfully.", lead });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const LeadModel = mongoose.model("Lead");
    const lead = await LeadModel.findById(id);
    if (!lead) {
      return res.status(404).json({ message: "Target lead document not found." });
    }

    lead.status = status;
    if (status === "contacted") lead.contactedAt = new Date();
    await lead.save();

    res.json({ success: true, message: "Lead status pipeline state advanced.", lead });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
