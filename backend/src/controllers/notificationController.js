import NotificationModel from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await NotificationModel.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

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
    const notification = await NotificationModel.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
