import mongoose from "mongoose";

const agentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
      required: true
    },

    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active"
    },

    availability: {
      type: String,
      enum: ["available", "busy", "offline", "on_leave"],
      default: "available"
    },

    specialization: {
      type: [String],
      default: []
    },

    languages: {
      type: [String],
      default: []
    },

    commissionSplit: {
      type: Number,
      default: 60 // agent gets 60%
    },

    totalDealsClosed: {
      type: Number,
      default: 0
    },

    totalRevenueGenerated: {
      type: Number,
      default: 0
    },

    totalLeadsHandled: {
      type: Number,
      default: 0
    },

    conversionRate: {
      type: Number,
      default: 0
    },

    averageResponseTime: {
      type: Number,
      default: 0
    },

    rating: {
      type: Number,
      default: 0
    },

    currentWorkload: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("AgentProfile", agentProfileSchema);