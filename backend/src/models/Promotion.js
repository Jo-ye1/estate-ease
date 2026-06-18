import mongoose from "mongoose";

const promotionSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },

      description: String,

      discountType: {
        type: String,
        enum: [
          "percentage",
          "fixed",
        ],
      },

      discountValue: Number,

      startsAt: Date,

      endsAt: Date,

      active: {
        type: Boolean,
        default: true,
      },
    },
    { timestamps: true }
  );

export default mongoose.model(
  "Promotion",
  promotionSchema
);