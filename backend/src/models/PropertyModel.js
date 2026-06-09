import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    area: { type: Number, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // ========================================================
    // CRUCIAL SCHEMA CORRECTION: MUST BE AN ARRAY OF STRINGS
    // ========================================================
    images: {
      type: [String],
      default: [], // Sets an empty array placeholder to prevent push errors
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Property", propertySchema);
