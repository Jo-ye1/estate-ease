import mongoose from "mongoose";

const userSubscriptionSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      plan: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "SubscriptionPlan",
        required: true,
      },

      status: {
      type: String,
      enum: ["active", "past_due", "unpaid", "cancelled", "expired"],
      default: "active",
      },

      startedAt: {
        type: Date,
        default: Date.now,
      },

      subscriptionExpiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },

    nextBillingDate: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },

    billingStatus: {
      type: String,
      enum: ["paid", "due", "failed", "grace_period"],
      default: "paid"
    },

      expiresAt: Date,
    },
    { timestamps: true }
  );

export default mongoose.model(
  "UserSubscription",
  userSubscriptionSchema
);