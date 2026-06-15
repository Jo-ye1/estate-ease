import Notification from "../models/Notification.js";

export const createNotification = async ({
  user,
  type,
  title,
  message,
  referenceId = null,
}) => {
  try {
    await Notification.create({
      user,
      type,
      title,
      message,
      referenceId,
    });
  } catch (error) {
    console.error(
      "Notification creation failed:",
      error.message
    );
  }
};