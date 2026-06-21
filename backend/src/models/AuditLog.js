import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    action: {
      type: String,
      required: true, // e.g., "PROPERTY_CREATED", "USER_PURGED", "ROLE_ESCALATED"
      index: true
    },
    targetType: {
      type: String,
      required: true // e.g., "Property", "User", "Lead", "Agency"
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {} // Stores textual changes, historical names, or browser trace details
    }
  },
  {
    timestamps: true // Chronologically captures the absolute execution timestamp automatically
  }
);

export default mongoose.model("AuditLog", auditLogSchema);
