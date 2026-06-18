import mongoose from "mongoose";

const PropertyAnalyticsSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      unique: true,
    },

    views: {
      type: Number,
      default: 0,
    },

    favorites: {
      type: Number,
      default: 0,
    },

    leadRequests: {
      type: Number,
      default: 0,
    },

    convertedLeads: {
      type: Number,
      default: 0,
    },

    daysOnMarket: {
      type: Number,
      default: 0,
    },

    // 🟢 ADDED: Tracking lifecycle metrics for performance analysis
    firstLeadAt: {
      type: Date,
      default: null,
    },

    closedAt: {
      type: Date,
      default: null,
    },

    approvalSubmittedAt: {
      type: Date,
      default: null,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } 
);

export default mongoose.model("PropertyAnalytics", PropertyAnalyticsSchema);
