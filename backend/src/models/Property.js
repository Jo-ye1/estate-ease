import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    listingType: {
      type: String,
      enum: ["sale", "rent", "hotel"],
      required: true,
    },

    pricing: {
      salePrice: Number,
      monthlyRent: Number,
      dailyRate: Number,
    },

    leaseDuration: {
      type: String,
      enum: ["weekly", "monthly", "yearly"],
    },

    availabilityStatus: {
      type: String,
      enum: ["available", "occupied", "reserved", "sold"],
      default: "available",
    },

    propertyCategory: {
      type: String,
      enum: [
        "house",
        "apartment",
        "villa",
        "hotel",
        "office",
        "land",
      ],
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    bedrooms: {
      type: Number,
      default: 0,
    },

    bathrooms: {
      type: Number,
      default: 0,
    },

    area: {
      type: Number,
      default: 0,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    maxGuests: {
      type: Number,
      default: 1,
    },

    listingStatus: {
      type: String,
      enum: [
        "draft",
        "pending",
        "published",
        "sold",
        "closed",
        "archived",
        "rejected"
      ],
      default: "draft",
    },

    images: {
      type: [String],
      default: [],
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    featuredUntil: {
      type: Date,
      default: null,
    },

    boostScore: {
      type: Number,
      default: 0,
    },

    boostExpiresAt: {
      type: Date,
      default: null,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    rejectedReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Property", propertySchema);
