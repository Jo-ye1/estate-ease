import UserSubscription from "../models/UserSubscription.js";
import SubscriptionPlan from "../models/SubscriptionPlan.js";
import Property from "../models/Property.js";
import mongoose from "mongoose";

export const requireFeature = (featureName) => async (req, res, next) => {
  try {
    const subscription = await UserSubscription.findOne({
      user: req.user._id,
      status: "active",
    }).populate("plan");

    if (!subscription) {
      return res.status(403).json({ message: "Active subscription required" });
    }

    const planConfig = subscription.plan;
    if (!planConfig || !planConfig[featureName]) {
      return res.status(403).json({ message: "Feature not available in current plan" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkListingLimit = async (req, res, next) => {
  try {
    // 🟢 1. DATABASE HEALING SCRIPT: Find and delete corrupt legacy flat-string records
    const corruptSubs = await UserSubscription.find({ user: req.user._id });
    
    for (const sub of corruptSubs) {
      // If the plan is saved as a plain text string like "Free" or "Pro", wipe it out
      if (!mongoose.Types.ObjectId.isValid(sub.plan)) {
        console.log(`🧹 [CLEANUP] Removing corrupt string subscription row: "${sub.plan}"`);
        await UserSubscription.deleteOne({ _id: sub._id });
      }
    }

    // 🟢 2. FETCH VALID ACTIVE PLAN: Query remaining proper relational rows
    let subscription = await UserSubscription.findOne({
      user: req.user._id,
      status: "active"
    }).sort({ createdAt: -1 }).populate("plan");

    // 🟢 3. IF MISSING, AUTO-PROVISION REAL OBJECTID FALLBACK
    if (!subscription) {
      console.log(`⚠️ [FEATURE GATE] Instantly provisioning clean fallback for User ID: ${req.user._id}`);
      
      const defaultFreePlanDoc = await SubscriptionPlan.findOne({ 
        name: { $regex: /^free$/i } 
      });

      if (!defaultFreePlanDoc) {
        throw new Error("Free subscription plan document missing from seeds. Run seedPlans first!");
      }

      subscription = await UserSubscription.create({
        user: req.user._id,
        plan: defaultFreePlanDoc._id,
        status: "active",
        startDate: new Date(),
        endDate: null
      });

      subscription.plan = defaultFreePlanDoc;
    }

    // 🟢 4. EXTRACT CAPACITY AND EVALUATE LIMITS
    const planConfig = subscription.plan;
    const planName = planConfig?.name || "Free";
    const maxListings = planConfig ? planConfig.listingLimit : 3;
    
    const currentListings = await Property.countDocuments({
      owner: req.user._id,
    });

    console.log(`➡️ [FEATURE GATE SYSTEM] User: ${req.user.email} | Evaluated Plan: "${planName}" | Active Limit Capacity: ${currentListings}/${maxListings}`);

    if (currentListings >= maxListings) {
      return res.status(403).json({
        message: `Listing limit reached. Your current plan tier allows up to ${maxListings} properties.`,
      });
    }

    next();
  } catch (error) {
    console.error("🔥 [FEATURE GATE RUNTIME ERROR]:", error.message);
    res.status(500).json({ message: error.message });
  }
};
