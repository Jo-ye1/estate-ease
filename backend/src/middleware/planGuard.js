import SubscriptionPlan from "../models/SubscriptionPlan.js";
import Property from "../models/Property.js";
import Subscription from "../models/Subscription.js";
import { getActiveSubscription } from "../utils/subscriptionHelper.js";

export const checkPlanLimit = (feature) => {
  return async (req, res, next) => {
    try {
      const sub = await getActiveSubscription(req.user._id);
      const planName = sub?.plan || "Free";
      
      const planConfig = await SubscriptionPlan.findOne({ 
        name: { $regex: new RegExp(`^${planName}$`, "i") } 
      });

      if (!planConfig || planConfig[feature] === false) {
        return res.status(403).json({
          message: "Upgrade required for this feature",
          feature,
          currentPlan: planName,
        });
      }

      req.plan = planConfig;
      req.subscription = sub;

      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

export const enforcePropertyLimit = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({
      user: req.user._id,
    });

    const planName = sub?.plan || "Free";
    const planConfig = await SubscriptionPlan.findOne({ 
      name: { $regex: new RegExp(`^${planName}$`, "i") } 
    });

    const maxProperties = planConfig ? planConfig.listingLimit : 3;
    const count = await Property.countDocuments({
      owner: req.user._id,
    });

    if (maxProperties !== -1 && count >= maxProperties) {
      return res.status(403).json({
        message: "Property limit reached. Upgrade plan.",
        limit: maxProperties,
        current: count,
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
