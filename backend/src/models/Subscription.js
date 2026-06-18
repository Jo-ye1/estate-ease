import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // 🔥 ONE active subscription per user
      index: true,
    },

    plan: {
      type: String,
      enum: ["free", "pro", "agency", "enterprise"],
      default: "free",
      index: true,
    },

    status: {
      type: String,
      enum: ["active", "expired", "cancelled", "trial"],
      default: "active",
      index: true,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
      default: null,
    },

    autoRenew: {
      type: Boolean,
      default: false,
    },

    stripeCustomerId: {
      type: String,
      default: null,
    },

    stripeSubscriptionId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);