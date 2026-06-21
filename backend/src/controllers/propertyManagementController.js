import mongoose from "mongoose";

export const getAgencyProperties = async (req, res) => {
  try {
    const AgencyModel = mongoose.model("Agency");
    const PropertyModel = mongoose.model("Property");

    const agency = await AgencyModel.findOne({ ownerId: req.user._id });
    if (!agency) {
      return res.status(404).json({ message: "Agency brokerage profile not found." });
    }

    const { listingStatus, listingType } = req.query;
    const filter = {
      $or: [
        { owner: req.user._id },
        { owner: { $in: agency.agents } },
        { assignedAgent: { $in: agency.agents } }
      ]
    };

    if (listingStatus) filter.listingStatus = listingStatus;
    if (listingType) filter.listingType = listingType;

    const properties = await PropertyModel.find(filter)
      .populate("owner", "name email")
      .populate("assignedAgent", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const assignPropertyToAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const { agentId } = req.body;

    const AgencyModel = mongoose.model("Agency");
    const PropertyModel = mongoose.model("Property");

    const agency = await AgencyModel.findOne({ ownerId: req.user._id });
    if (!agency) {
      return res.status(403).json({ message: "Forbidden: Management authorization token validation failed." });
    }

    if (!agency.agents.includes(agentId) && agentId !== req.user._id.toString()) {
      return res.status(400).json({ message: "Target user is not registered in this agency roster matrix." });
    }

    const property = await PropertyModel.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Target property record not found." });
    }

    property.assignedAgent = agentId;
    await property.save();

    res.json({ success: true, message: "Property assignment updated successfully.", property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
