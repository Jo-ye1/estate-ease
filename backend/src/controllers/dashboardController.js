import Property from "../models/Property.js";
import Lead from "../models/Lead.js";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

export const getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const activeProperties = await Property.countDocuments({
      owner: ownerId,
      listingStatus: {
        $in: ["published", "draft"],
      },
    });

    const soldProperties = await Property.countDocuments({
      owner: ownerId,
      listingStatus: "sold",
    });

    const totalLeads = await Lead.countDocuments({
      owner: ownerId,
    });

    const convertedLeads = await Lead.countDocuments({
      owner: ownerId,
      status: "closed",
    });

    const conversations = await Conversation.find({
      participants: ownerId,
    });

    const conversationIds = conversations.map(
      (c) => c._id
    );

    const unreadMessages =
      await Message.countDocuments({
        conversation: {
          $in: conversationIds,
        },
        sender: { $ne: ownerId },
        isRead: false,
      });

    const recentLeads = await Lead.find({
      owner: ownerId,
    })
      .populate("property", "title")
      .populate("buyer", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentConversations =
      await Conversation.find({
        participants: ownerId,
      })
        .populate(
          "participants",
          "name avatar"
        )
        .sort({ lastMessageAt: -1 })
        .limit(5);

    const leadConversion =
      totalLeads > 0
        ? (
            (convertedLeads / totalLeads) *
            100
          ).toFixed(1)
        : 0;

    res.json({
      success: true,
      dashboard: {
        activeProperties,
        soldProperties,
        totalLeads,
        unreadMessages,
        leadConversion,
        recentLeads,
        recentConversations,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};