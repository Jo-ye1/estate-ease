import Subscription from "../models/Subscription.js";
import Notification from "../models/Notification.js";

export const getActiveSubscription = async (userId) => {
  const sub = await Subscription.findOne({ user: userId });

  if (!sub) return { plan: "Free", status: "active" };

  if (sub.endDate && sub.endDate < new Date()) {
    sub.status = "expired";
    await sub.save();
    return { plan: "Free", status: "expired" };
  }

  if (sub.status === "active" && sub.endDate) {
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
    const timeUntilExpiry = sub.endDate.getTime() - Date.now();

    if (timeUntilExpiry > 0 && timeUntilExpiry <= threeDaysInMs) {
      const existingAlert = await Notification.findOne({
        user: userId,
        type: "subscription",
        title: "Subscription Expiring"
      });

      if (!existingAlert) {
        await Notification.create({
          user: userId,
          type: "subscription",
          title: "Subscription Expiring",
          message: "Your plan expires in 3 days.",
        });
      }
    }
  }

  return sub;
};
