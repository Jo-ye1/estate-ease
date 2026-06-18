import mongoose from "mongoose";

const couponSchema =
  new mongoose.Schema(
    {
      code: {
        type: String,
        unique: true,
      },

      discountType: {
        type: String,
        enum: [
          "percentage",
          "fixed",
        ],
      },

      discountValue: Number,

      usageLimit: Number,

      usedCount: {
        type: Number,
        default: 0,
      },

      expiresAt: Date,

      active: {
        type: Boolean,
        default: true,
      },
    },
    { timestamps: true }
  );

export default mongoose.model(
  "Coupon",
  couponSchema
);