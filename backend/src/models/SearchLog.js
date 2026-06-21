import mongoose from "mongoose";

const searchLogSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      keyword: String,
      location: String,
      category: String,
      operation: String,
      bedrooms: Number,

      minPrice: Number,
      maxPrice: Number,
    },
    { timestamps: true }
  );

export default mongoose.model(
  "SearchLog",
  searchLogSchema
);