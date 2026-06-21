import Billing from "../models/Billing.js";
import UserSubscription from "../models/UserSubscription.js";
import SubscriptionPlan from "../models/SubscriptionPlan.js";
import Notification from "../models/Notification.js";
import mongoose from "mongoose";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getMyBilling = async (req, res) => {
  try {
    const billing = await Billing.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    const subscription = await UserSubscription.findOne({
      user: req.user._id,
      status: "active",
    })
      .sort({ createdAt: -1 })
      .populate("plan");

    res.json({
      billing,
      subscription,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createCheckoutSession = async (req, res) => {
  try {
    const { planId } = req.body;

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${plan.name} Plan Membership`,
              description: `Upgrade threshold allocations to ${plan.listingLimit} properties.`,
            },
            unit_amount: plan.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/billing?session_id={CHECKOUT_SESSION_ID}&planName=${plan.name}&amount=${plan.price}`,
      cancel_url: `http://localhost:5173/pricing`,
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const processSuccessfulPayment = async (req, res) => {
  try {
    const { amount, planName } = req.body;

    let formattedPlanName = "Free";
    if (planName?.toLowerCase() === "pro") formattedPlanName = "Pro";
    if (planName?.toLowerCase() === "enterprise") formattedPlanName = "Enterprise";

    const planConfigDoc = await SubscriptionPlan.findOne({
      name: { $regex: new RegExp(`^${formattedPlanName}$`, "i") }
    });

    if (!planConfigDoc) {
      return res.status(404).json({ message: "Subscription plan configuration not found" });
    }

    const payment = await Billing.create({
      user: req.user._id,
      amount: Number(amount),
      status: "paid",
      billingDate: new Date(),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    const subscriptionData = { 
      plan: planConfigDoc._id, 
      status: "active", 
      startDate: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };

    const userSub = await UserSubscription.findOneAndUpdate(
      { user: req.user._id },
      subscriptionData,
      { returnDocument: "after", upsert: true }
    ).populate("plan");

    try {
      const SyncModel = mongoose.model("Subscription");
      await SyncModel.findOneAndUpdate(
        { user: req.user._id },
        { plan: formattedPlanName.toLowerCase(), status: "active", startDate: new Date() },
        { upsert: true }
      );
    } catch (e) {
      // safe bypass
    }

    await Notification.create({
      user: req.user._id,
      type: "billing",
      title: "Payment Successful",
      message: `Your payment of $${payment.amount} was successful.`,
    });

    res.status(201).json({ success: true, payment, subscription: userSub });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
