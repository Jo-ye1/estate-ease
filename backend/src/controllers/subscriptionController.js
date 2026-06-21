import SubscriptionPlan from "../models/SubscriptionPlan.js";
import UserSubscription from "../models/UserSubscription.js";
import Billing from "../models/Billing.js";
import Notification from "../models/Notification.js";
import stripe from "../config/stripe.js";
import { PLANS } from "../config/plans.js";

export const getPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const subscribeToPlan = async (req, res) => {
  try {
    const { planId } = req.body;

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const subscription = await UserSubscription.create({
      user: req.user._id,
      plan: plan._id,
      status: "active",
      startedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    await Billing.create({
      user: req.user._id,
      subscription: subscription._id,
      amount: plan.price,
      status: "paid",
      nextBillingDate: subscription.expiresAt,
    });

    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMySubscription = async (req, res) => {
  try {
    const sub = await UserSubscription.findOne({ user: req.user._id }).populate("plan");
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
};

export const upgradePlan = async (req, res) => {
  try {
    const { planId } = req.body;

    const targetPlan = await SubscriptionPlan.findById(planId);
    if (!targetPlan) {
      return res.status(404).json({ message: "Target plan configuration not found" });
    }

    let sub = await UserSubscription.findOne({ user: req.user._id });
    const oldPlanId = sub ? sub.plan : null;

    if (!sub) {
      sub = new UserSubscription({ user: req.user._id });
    }

    sub.plan = targetPlan._id;
    sub.status = "active";
    sub.startedAt = new Date();
    sub.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await sub.save();

    await Billing.create({
      user: req.user._id,
      subscription: sub._id,
      amount: targetPlan.price,
      status: "paid",
      nextBillingDate: sub.expiresAt,
    });

    res.json({
      success: true,
      oldPlan: oldPlanId,
      newPlan: sub.plan,
      subscription: sub,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const subscription = await UserSubscription.findOne({ user: req.user._id });
    if (!subscription) {
      return res.status(404).json({ message: "Subscription context not found" });
    }

    subscription.status = "cancelled";
    await subscription.save();

    await Notification.create({
      user: req.user._id,
      type: "billing",
      title: "Subscription Canceled",
      message: "Your subscription downgrade auto-renewal track has been turned off.",
    });

    res.json({ success: true, message: "Subscription canceled successfully", subscription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlanCapabilities = async (req, res) => {
  try {
    const sub = await UserSubscription.findOne({ user: req.user._id }).populate("plan");
    const planKey = sub?.plan?.name?.toLowerCase() || "free";

    res.json({
      plan: planKey,
      limits: PLANS[planKey] || PLANS["free"],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCheckoutSession = async (req, res) => {
  try {
    const { planId } = req.body;

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
            },
            unit_amount: plan.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: "http://localhost:5173/billing?session_id={CHECKOUT_SESSION_ID}&planName=" + plan.name + "&amount=" + plan.price,
      cancel_url: "http://localhost:5173/pricing",
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await UserSubscription.find({})
      .populate("user", "name email")
      .populate("plan")
      .sort({ createdAt: -1 });

    res.json({ success: true, subscriptions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
