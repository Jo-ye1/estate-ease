import mongoose from "mongoose";

const recentlyViewedSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      property: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true,
      },

      lastViewedAt: {
        type: Date,
        default: Date.now,
      },
    },
    { timestamps: true }
  );

export default mongoose.model(
  "RecentlyViewed",
  recentlyViewedSchema
);