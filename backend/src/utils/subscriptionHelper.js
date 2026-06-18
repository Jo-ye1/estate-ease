import Subscription from "../models/Subscription.js";

export const getActiveSubscription = async (userId) => {
  const sub = await Subscription.findOne({ user: userId });

  if (!sub) return { plan: "free", status: "active" };

  // 🔥 AUTO EXPIRE CHECK (SaaS safety layer)
  if (sub.endDate && sub.endDate < new Date()) {
    sub.status = "expired";
    await sub.save();

    return { plan: "free", status: "expired" };
  }

  return sub;
};