import Notification from "../models/Notification.js";

const createNotification = async ({
  recipient,
  sender = null,
  type,
  title,
  message,
  relatedId = null,
  relatedType = "",
}) => {
  await Notification.create({
    recipient,
    sender,
    type,
    title,
    message,
    relatedId,
    relatedType,
  });
};

export default createNotification;