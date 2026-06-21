import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { createNotification } from "../utils/createNotification.js";
import { getIO, getReceiverSocket } from "../socket/socket.js";

export const getConversations = async (
  req,
  res
) => {
  try {
    const conversations =
      await Conversation.find({
        participants: req.user._id,
      })
        .populate("property", "title location images")
        .populate(
          "participants",
          "name email avatar"
        )
        .sort({ lastMessageAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMessages = async (
  req,
  res
) => {
  try {
    const conversation =
      await Conversation.findById(
        req.params.id
      );

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    const isParticipant =
      conversation.participants.some(
        (p) =>
          p.toString() ===
          req.user._id.toString()
      );

    if (!isParticipant) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const messages = await Message.find({
      conversation: req.params.id,
    })
      .populate("sender", "name email avatar")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;

    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const receiver = conversation.participants.find(
      (p) => p.toString() !== req.user._id.toString()
    );

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      receiver,
      property: conversation.property || null,
      text,
    });

    conversation.lastMessage = text;
    conversation.lastMessageAt = new Date();

    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name email avatar");

    if (receiver) {
      try {
        await createNotification({
          recipient: messageReceiverId,
          user: receiver,
          sender: req.user._id,
          type: "message",
          title: "New Message",
          message: text,
          relatedId: message._id,
          relatedType: "Message",
        });
      } catch (notifError) {
        console.error("Notification logging failed, suppressing to continue chat thread creation:", notifError.message);
      }

      const receiverSocket = getReceiverSocket(receiver.toString());

      if (receiverSocket) {
        getIO().to(receiverSocket).emit("newMessage", populatedMessage);
      }
    }

    res.status(201).json({
      success: true,
      message: populatedMessage,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const markMessagesRead = async (
  req,
  res
) => {
  try {
    await Message.updateMany(
      {
        conversation: req.params.id,
        sender: {
          $ne: req.user._id,
        },
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
