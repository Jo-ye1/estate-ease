import mongoose from "mongoose";
import { createNotification } from "../utils/createNotification.js";

export const renewPropertyListing = async (req, res) => {
  try {
    const { id } = req.params;
    const PropertyModel = mongoose.model("Property");

    const property = await PropertyModel.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property listing not found" });
    }

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized: You do not own this listing asset." });
    }

    property.listingStatus = "pending";
    property.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await property.save();

    res.json({
      success: true,
      message: "Property listing successfully extended and returned to the admin moderation queue.",
      property
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPropertySLAMetrics = async (req, res) => {
  try {
    const { id } = req.params;
    const LeadModel = mongoose.model("Lead");
    const PropertyModel = mongoose.model("Property");

    const property = await PropertyModel.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property asset row not found" });
    }

    const leads = await LeadModel.find({ propertyId: id }).sort({ createdAt: 1 });
    const creationDate = new Date(property.createdAt);

    let timeToFirstLead = "No leads received yet";
    if (leads.length > 0) {
      const firstLeadDate = new Date(leads[0].createdAt);
      const diffTime = Math.abs(firstLeadDate - creationDate);
      timeToFirstLead = `${Math.ceil(diffTime / (1000 * 60 * 60 * 24))} days`;
    }

    const wonLead = leads.find(l => l.status === "won");
    let timeToClose = "Not closed yet";
    if (wonLead) {
      const closeDate = new Date(wonLead.updatedAt);
      const diffTime = Math.abs(closeDate - creationDate);
      timeToClose = `${Math.ceil(diffTime / (1000 * 60 * 60 * 24))} days`;
    }

    const lastActivityDate = leads.length > 0 ? new Date(leads[leads.length - 1].updatedAt) : creationDate;
    const diffTimeStale = Math.abs(new Date() - lastActivityDate);
    const daysWithoutLead = Math.floor(diffTimeStale / (1000 * 60 * 60 * 24));

    res.json({
      success: true,
      metrics: {
        timeToFirstLead,
        timeToClose,
        daysWithoutLead,
        totalLeadsCount: leads.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
