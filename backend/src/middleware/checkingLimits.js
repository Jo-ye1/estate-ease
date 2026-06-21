import UserSubscription from "../models/UserSubscription.js";
import SubscriptionPlan from "../models/SubscriptionPlan.js";
import Property from "../models/Property.js";

export const checkListingLimit = async (req, res, next) => {
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

    // 🟢 DYNAMIC STRING FIX: Clean fallback defaults if relation mapping is flat string text
    const planName = subscription.plan || "Free";
    const planConfig = await SubscriptionPlan.findOne({ 
      name: { $regex: new RegExp(`^${planName}$`, "i") } 
    });

    const maxListings = planConfig ? planConfig.listingLimit : 3;
    const currentListings = await Property.countDocuments({
      owner: req.user._id,
    });

    if (currentListings >= maxListings) {
      return res.status(403).json({
        message: `Listing limit reached. Your current plan tier allows up to ${maxListings} properties.`,
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
