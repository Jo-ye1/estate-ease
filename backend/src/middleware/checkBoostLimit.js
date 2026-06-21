import UserSubscription from "../models/UserSubscription.js";
import SubscriptionPlan from "../models/SubscriptionPlan.js";
import Property from "../models/Property.js";

export const checkBoostLimit = async (req, res, next) => {
  try {
    const subscription = await UserSubscription.findOne({
      user: req.user._id,
      status: "active",
    });

    if (!subscription) {
      return res.status(403).json({
        message: "Active subscription required",
      });
    }

    const planName = subscription.plan || "Free";
    const planConfig = await SubscriptionPlan.findOne({ 
      name: { $regex: new RegExp(`^${planName}$`, "i") } 
    });

    const maxBoosts = planConfig ? planConfig.boostLimit : 0;
    const boostedCount = await Property.countDocuments({
      owner: req.user._id,
      featured: true,
    });

    if (boostedCount >= maxBoosts) {
      return res.status(403).json({
        message: `Boost limit reached. Your current plan tier allows up to ${maxBoosts} boosted properties.`,
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
