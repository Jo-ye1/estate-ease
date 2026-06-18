import mongoose from "mongoose";

const savedSearchSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    keyword: String,
    location: String,
    category: String,
    listingType: String,

    bedrooms: Number,

    minPrice: Number,
    maxPrice: Number,
  },
  { timestamps: true }
);

export default mongoose.model(
  "SavedSearch",
  savedSearchSchema
);