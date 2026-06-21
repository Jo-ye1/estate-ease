import Lead from "../models/Lead.js";
import Property from "../models/Property.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import Notification from "../models/Notification.js"; 
import { trackLeadRequest, trackLeadConversion } from "../services/propertyAnalyticsService.js";
import { createAuditLog } from "../services/auditService.js"; 
import { createNotification } from "../utils/createNotification.js";
import {
  getIO,
  getReceiverSocket,
} from "../socket/socket.js";
import AuditLog from "../models/AuditLog.js";
import { logRevenue } from "../services/revenueService.js";
import FollowUp from "../models/FollowUp.js";
import { sendMarketplaceEmail } from "../utils/emailService.js"


export const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find({})
      .populate("property", "title location")
      .populate("owner", "name email")
      .populate("buyer", "name email")
      .sort({ createdAt: -1 });

    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createLead = async (req, res) => {
  try {
    const property = await Property.findById(
      req.params.id
    ).populate("owner");

    if (!property) {
      return res
        .status(404)
        .json({ message: "Property not found" });
    }

    if (req.user?._id) {
      const existingLead = await Lead.findOne({
        property: property._id,
        buyer: req.user._id,
        status: {
          $in: ["new", "contacted"],
        },
      });

      if (existingLead) {
        return res.status(400).json({
          message:
            "You already have an active inquiry for this property",
        });
      }
    }

    const leadOwnerId = property.assignedAgent || property.owner._id;

    const lead = await Lead.create({
      property: property._id,
      owner: leadOwnerId,
      buyer: req.user?._id || null,
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
      status: "new",
    });

    const populatedPropertyContext = await Property.findById(property._id).populate("owner", "email name");

    if (populatedPropertyContext?.owner?.email) {
      await sendMarketplaceEmail({
        to: populatedPropertyContext.owner.email,
        subject: "New buyer interest detected!",
        text: `Hello ${populatedPropertyContext.owner.name},\n\nA new buyer has shown interest in your property listing: "${populatedPropertyContext.title}". Log into your pipeline dashboard space to view their details.`
      });
    }

    const nextDate = new Date();
    nextDate.setDate(
      nextDate.getDate() + 2
    );

    await FollowUp.create({
      lead: lead._id,
      owner: leadOwnerId,
      nextFollowUp: nextDate,
    });

    await createNotification({
      recipient: property.owner, 
      type: "NEW_LEAD_RECEIVED",
      title: "New Property Inquiry Received",
      message: `A new buyer has shown interest in your property listing: ${property.title}.`,
      relatedId: lead._id,
      relatedType: "Lead"
    });

    await trackLeadRequest(property._id);

    await createAuditLog({
      actor: req.user?._id || null,
      action: "LEAD_CREATED",
      targetType: "Lead",
      targetId: lead._id,
    });

    let conversation = null;
    let message = null;

    if (req.user?._id) {
      conversation =
        await Conversation.findOne({
          property: property._id,
          participants: {
            $all: [
              leadOwnerId,
              req.user._id,
            ],
          },
        });

      if (!conversation) {
        conversation =
          await Conversation.create({
            participants: [
              leadOwnerId,
              req.user._id,
            ],
            property: property._id,
            lastMessage: req.body.message,
            lastMessageAt: new Date(),
          });
      }

      message = await Message.create({
        conversation: conversation._id,
        sender: req.user._id,
        receiver: leadOwnerId,
        property: property._id,
        text: req.body.message,
      });

      conversation.lastMessage =
        req.body.message;
      conversation.lastMessageAt =
        new Date();

      await conversation.save();
    }

    await createNotification({
      recipient: leadOwnerId,
      sender: req.user?._id || null,
      type: "NEW_LEAD",
      title: "New Lead Received",
      message: `${req.user?.name || "A visitor"} submitted a lead`,
      relatedId: lead._id,
      relatedType: "Lead",
    });

    const io = getIO();
    const receiverSocket =
      getReceiverSocket(
        leadOwnerId.toString()
      );

    if (receiverSocket) {
      io.to(receiverSocket).emit(
        "newNotification"
      );
    }

    res.status(201).json({
      success: true,
      lead,
      conversation,
      message,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const updateLeadPipeline = async (req, res) => {
  try {
    const { status, lossReason } = req.body;

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    lead.status = status;

    if (status === "contacted") lead.contactedAt = new Date();
    if (status === "qualified") lead.qualifiedAt = new Date();
    if (status === "negotiating") lead.negotiatingAt = new Date();
    if (status === "won" || status === "lost") lead.closedAt = new Date();
    if (status === "lost") lead.lossReason = lossReason || "";

    await lead.save();

    if (status === "won") {
      await trackLeadConversion(lead.property);

      const property = await Property.findById(lead.property);
      if (property) {
        let amount = 0;
        if (property.listingType === "sale") amount = property.pricing?.salePrice || 0;
        if (property.listingType === "rent") amount = property.pricing?.monthlyRent || 0;
        if (property.listingType === "hotel") amount = property.pricing?.dailyRate || 0;

        await logRevenue({
          user: lead.owner,
          property: lead.property,
          type: property.listingType,
          amount: amount,
          source: "property",
        });
      }
    }

    await AuditLog.create({
      actor: req.user._id,
      action: "LEAD_PIPELINE_UPDATED",
      targetId: lead._id,
      targetType: "Lead",
      message: `Lead moved to ${status}`,
    });

    if (lead.buyer) {
      await createNotification({
        recipient: lead.buyer,
        sender: req.user._id,
        type: "LEAD_UPDATED",
        title: "Lead Status Updated",
        message: `Your lead moved to ${status}`,
        relatedId: lead._id,
        relatedType: "Lead",
      });
    }

    res.json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getMyLeads = async (
  req,
  res
) => {
  try {
    const leads = await Lead.find({
      owner: req.user._id,
    })
      .populate("property", "title location")
      .populate("buyer", "name email")
      .sort({ createdAt: -1 });

    res.json(leads);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMySentLeads = async (
  req,
  res
) => {
    try {
      const leads = await Lead.find({
        buyer: req.user._id,
      })
        .populate(
          "property",
          "title location pricing images"
        )
        .populate(
          "owner",
          "name email avatar"
        )
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

export const getLeadResponseMetrics = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const leads = await Lead.find({
      owner: ownerId,
      contactedAt: { $ne: null },
    });

    const totalResponseTime = leads.reduce(
      (acc, lead) =>
        acc + (lead.contactedAt - lead.createdAt),
      0
    );

    const avgResponseTime =
      leads.length > 0
        ? totalResponseTime / leads.length
        : 0;

    res.json({
      totalResponded: leads.length,
      avgResponseTime,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
