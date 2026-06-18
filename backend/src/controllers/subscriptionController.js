import Subscription from "../models/Subscription.js";
import { PLANS } from "../config/plans.js";

export const getMySubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({
      user: req.user._id,
    });

    if (!sub) {
      return res.json({
        plan: "free",
        status: "active",
      });
    }

    res.json(sub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const upgradePlan = async (req, res) => {
  try {
    const { plan } = req.body;

    let sub = await Subscription.findOne({
      user: req.user._id,
    });

    if (!sub) {
      sub = new Subscription({
        user: req.user._id,
      });
    }

    const oldPlan = sub.plan;

    sub.plan = plan;
    sub.status = "active";
    sub.startDate = new Date();
    sub.endDate = null;

    await sub.save();

    res.json({
      success: true,
      oldPlan,
      newPlan: sub.plan,
      subscription: sub,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlanCapabilities = async (req, res) => {
  try {
    const sub = await Subscription.findOne({
      user: req.user._id,
    });

    const planKey = sub?.plan || "free";

    res.json({
      plan: planKey,
      limits: PLANS[planKey],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


