import Notification from "../models/Notification.js";

export const getMyNotifications = async (
  req,
  res
) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("sender", "name");

    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const markNotificationRead = async (
  req,
  res
) => {
  try {
    const notification =
      await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    notification.isRead = true;

    await notification.save();

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// 🟢 ADD TO THE BOTTOM OF src/controllers/notificationController.js

export const getUnreadCount = async (
  req,
  res
) => {
  try {
    const count =
      await Notification.countDocuments({
        recipient: req.user._id,
        isRead: false,
      });

    res.json({ count });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
