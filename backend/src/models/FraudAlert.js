import mongoose from "mongoose";

const fraudAlertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true
    },
    triggerType: {
      type: String,
      enum: ["DUPLICATE_LISTING", "LEAD_SPAM", "MESSAGE_SPAM", "SUSPICIOUS_LOGIN"],
      required: true
    },
    riskScore: {
      type: Number,
      required: true, // Scale of 1 - 100
    },
    actionTaken: {
      type: String,
      enum: ["AUTO_FLAG", "MANUAL_REVIEW", "TEMPORARY_FREEZE"],
      required: true
    },
    evidenceMetadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("FraudAlert", fraudAlertSchema);
