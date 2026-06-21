import mongoose from "mongoose";

const billingSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      subscription: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "UserSubscription",
      },

      amount: {
        type: Number,
        required: true,
      },

      currency: {
        type: String,
        default: "USD",
      },

      status: {
        type: String,
        enum: [
          "paid",
          "pending",
          "failed",
        ],
        default: "pending",
      },

      billingDate: {
        type: Date,
        default: Date.now,
      },

      nextBillingDate: Date,
    },
    { timestamps: true }
  );

export default mongoose.model(
  "Billing",
  billingSchema
);