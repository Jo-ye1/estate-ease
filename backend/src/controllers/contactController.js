import Lead from "../models/Lead.js";
import Property from "../models/Property.js";
import { createNotification } from "../utils/createNotification.js";

export const contactAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, message } = req.body;

    const property = await Property.findById(id).populate("owner");

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    const lead = await Lead.create({
      property: property._id,
      owner: property.owner._id,
      buyer: req.user?._id || null,
      name,
      email,
      message,
    });

    await createNotification({
      user: property.owner._id,
      type: "NEW_LEAD",
      title: "New Lead Received",
      message: `${name} sent an inquiry for "${property.title}"`,
      referenceId: lead._id,
    });

    res.status(201).json({
      success: true,
      message: "Lead submitted successfully",
      lead,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};