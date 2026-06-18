import mongoose from "mongoose";

const revenueSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },

    type: {
      type: String,
      enum: [
        "sale",
        "rent",
        "hotel",
        "boost",
        "subscription",
      ],
      required: true,
    },

    amount: {
      type: Number,
      default: 0,
    },

    source: {
      type: String,
      enum: [
        "property",
        "featured",
        "system",
      ],
      default: "property",
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "Revenue",
  revenueSchema
);