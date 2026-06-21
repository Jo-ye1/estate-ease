import mongoose from "mongoose";
import { getIO, getReceiverSocket } from "../socket/socket.js";

const SELLER_TRIGGERS = [
  "NEW_LEAD_RECEIVED",
  "LEAD_STATUS_UPDATED",
  "PROPERTY_APPROVED",
  "PROPERTY_REJECTED",
  "PROPERTY_EXPIRED",
  "PAYMENT_DUE",
  "RENEWAL_REMINDER",
  "PROPERTY_FEATURED",
  "MESSAGE_RECEIVED"
];

const ADMIN_TRIGGERS = [
  "NEW_SELLER_REGISTERED",
  "PROPERTY_SUBMITTED",
  "PROPERTY_FLAGGED",
  "USER_REPORTED",
  "LEAD_ABUSE_ALERT",
  "PAYMENT_FAILURE_ALERT",
  "SYSTEM_WARNING"
];

const SUPERADMIN_TRIGGERS = [
  "ADMIN_CREATED",
  "ADMIN_DELETED",
  "ROLE_ESCALATION",
  "SYSTEM_CRITICAL",
  "DATABASE_WARNING",
  "SECURITY_BREACH",
  "PLATFORM_ANALYTICS_ALERT"
];

export const createNotification = async ({
  recipient,
  sender = null,
  type,
  title,
  message,
  relatedId = null,
  relatedType = "",
}) => {
  try {
    const NotificationModel = mongoose.model("Notification");
    const UserModel = mongoose.model("User");

    let finalRecipientId = recipient;

    if (!finalRecipientId) {
      if (ADMIN_TRIGGERS.includes(type)) {
        const adminUser = await UserModel.findOne({ role: { $in: ["admin", "super_admin"] } });
        finalRecipientId = adminUser ? adminUser._id : null;
      } else if (SUPERADMIN_TRIGGERS.includes(type)) {
        const superAdminUser = await UserModel.findOne({ role: "super_admin" });
        finalRecipientId = superAdminUser ? superAdminUser._id : null;
      }
    }

    if (!finalRecipientId) return null;

    const formattedTitle = title || type.replace(/_/g, " ");

    const notification = await NotificationModel.create({
      recipient: finalRecipientId,
      sender,
      type,
      title: formattedTitle,
      message,
      relatedId,
      relatedType,
      isRead: false
    });

    const clientSocketId = getReceiverSocket(finalRecipientId.toString());
    if (clientSocketId) {
      const io = getIO();
      io.to(clientSocketId).emit("newNotification", notification);
    }

    if (ADMIN_TRIGGERS.includes(type)) {
      const activeAdmins = await UserModel.find({ role: { $in: ["admin", "super_admin"] } });
      const io = getIO();
      for (const adm of activeAdmins) {
        const admSocket = getReceiverSocket(adm._id.toString());
        if (admSocket && adm._id.toString() !== finalRecipientId.toString()) {
          io.to(admSocket).emit("newNotification", notification);
        }
      }
    }

    return notification;
  } catch (error) {
    console.error("🔥 [NOTIFICATION DISPATCH MATRIX EXCEPTION]:", error.message);
    return null;
  }
};
