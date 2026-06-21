import Notification from "../models/Notification.js";
import mongoose from "mongoose";

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { user: req.user._id },
        { recipient: req.user._id }
      ]
    }).sort({
      createdAt: -1,
    });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      $or: [
        { user: req.user._id },
        { recipient: req.user._id }
      ],
      isRead: false,
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      {
        $or: [
          { user: req.user._id },
          { recipient: req.user._id }
        ],
        isRead: false
      },
      { $set: { isRead: true } }
    );

    res.json({
      success: true,
      message: "All notifications marked as read.",
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const ownerId = notification.user || notification.recipient;
    if (ownerId && ownerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized access block" });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
