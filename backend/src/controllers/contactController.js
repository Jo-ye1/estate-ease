import Lead from "../models/Lead.js";
import Property from "../models/Property.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
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

    // Create lead
    const lead = await Lead.create({
      property: property._id,
      owner: property.owner._id,
      buyer: req.user?._id || null,
      name,
      email,
      message,
    });

    let conversation = await Conversation.findOne({
      property: property._id,
      participants: {
        $all: [req.user._id, property.owner._id],
      },
    });

    // Create conversation if missing
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [
          req.user._id,
          property.owner._id,
        ],
        property: property._id,
        lastMessage: message,
        lastMessageAt: new Date(),
      });
    }

    // Create first message
    const firstMessage = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      receiver: property.owner._id,
      property: property._id,
      text: message,
    });

    // Update conversation
    conversation.lastMessage = message;
    conversation.lastMessageAt = new Date();

    await conversation.save();

    // Notify owner
    await createNotification({
      user: property.owner._id,
      type: "NEW_LEAD",
      title: "New Lead Received",
      message: `${name} sent an inquiry for "${property.title}"`,
      referenceId: lead._id,
    });

    res.status(201).json({
      success: true,
      message: "Inquiry sent successfully",
      lead,
      conversationId: conversation._id,
      firstMessage,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};