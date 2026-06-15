import Lead from "../models/Lead.js";
import Property from "../models/Property.js";
import { createNotification } from "../utils/createNotification.js";

export const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find({})
      .populate("property", "title location")
      .populate("owner", "name email")
      .populate("buyer", "name email")
      .sort({ createdAt: -1 });

    res.json(leads);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createLead = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    if (req.user?._id) {
      const existingLead = await Lead.findOne({
        property: property._id,
        buyer: req.user._id,
        status: { $in: ["pending", "contacted"] },
      });

      if (existingLead) {
        return res.status(400).json({
          message: "You already have an active inquiry for this property",
        });
      }
    }

    const lead = await Lead.create({
      property: property._id,
      owner: property.owner,
      buyer: req.user?._id || null,
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
    });

    await createNotification({
      user: property.owner,
      type: "NEW_LEAD",
      title: "New Lead Received",
      message: `New inquiry for "${property.title}"`,
      referenceId: lead._id,
    });

    res.status(201).json({
      success: true,
      lead,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const lead = await Lead.findById(req.params.id).populate("property", "title");

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    if (lead.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    lead.status = status;
    await lead.save();

    if (lead.buyer) {
      await createNotification({
        user: lead.buyer,
        type: "LEAD_UPDATED",
        title: "Lead Status Updated",
        message: `Your inquiry for "${lead.property.title}" is now ${status}`,
        referenceId: lead._id,
      });
    }

    res.json({
      success: true,
      lead,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyLeads = async (req, res) => {
  try {
    const leads = await Lead.find({
      owner: req.user._id,
    })
      .populate("property", "title location")
      .populate("buyer", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      leads,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const getMySentLeads = async (req, res) => {
  try {
    const leads = await Lead.find({
      buyer: req.user._id,
    })
      .populate("property", "title location pricing images")
      .populate("owner", "name email avatar")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      leads,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
