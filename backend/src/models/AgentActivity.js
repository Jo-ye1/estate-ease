import mongoose from "mongoose";

const agentActivitySchema = new mongoose.Schema(
  {
    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
      required: true
    },

    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    actionType: {
      type: String,
      enum: [
        "lead_assigned",
        "property_assigned",
        "deal_created",
        "deal_closed",
        "commission_paid",
        "task_created",
        "task_assigned",
        "task_started",
        "task_completed",
        "task_cancelled",
        "task_overdue",
        "status_changed",
        "lead_stage_changed"
      ],
      required: true
    },

    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      default: ""
    },

    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },

    relatedType: {
      type: String,
      enum: [
        "Lead",
        "Property",
        "Deal",
        "Commission",
        "Task",
        "Status"
      ],
      default: null
    },

    metadata: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

agentActivitySchema.index({ agentId: 1 });
agentActivitySchema.index({ agencyId: 1 });
agentActivitySchema.index({ createdAt: -1 });

export default mongoose.models.AgentActivity || mongoose.model("AgentActivity", agentActivitySchema);
