import mongoose from "mongoose";

const subscriptionPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, 
    },

    price: {
      type: Number,
      default: 0,
    },

    listingLimit: {
      type: Number,
      default: 5,
    },

    boostLimit: {
      type: Number,
      default: 0,
    },

    analyticsAccess: {
      type: Boolean,
      default: false,
    },

    prioritySupport: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("SubscriptionPlan", subscriptionPlanSchema);
