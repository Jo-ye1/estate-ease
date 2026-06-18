import { PLANS } from "../config/plans.js";
import { getActiveSubscription } from "../utils/subscriptionHelper.js";
import Property from "../models/Property.js"; // 🟢 Added to allow counting properties
import Subscription from "../models/Subscription.js"; // 🟢 Added to query subscriptions directly

export const checkPlanLimit = (feature) => {
  return async (req, res, next) => {
    try {
      const sub = await getActiveSubscription(req.user._id);
      const plan = PLANS[sub.plan || "free"];

      if (plan[feature] === false) {
        return res.status(403).json({
          message: "Upgrade required for this feature",
          feature,
          currentPlan: sub.plan,
        });
      }

      req.plan = plan;
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

    const plan = PLANS[sub?.plan || "free"];

    const count = await Property.countDocuments({
      owner: req.user._id,
    });

    if (
      plan.maxProperties !== -1 &&
      count >= plan.maxProperties
    ) {
      return res.status(403).json({
        message: "Property limit reached. Upgrade plan.",
        limit: plan.maxProperties,
        current: count,
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};