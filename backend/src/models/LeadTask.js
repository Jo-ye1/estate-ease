import mongoose from "mongoose";

const leadTaskSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium"
    },
    dueDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled"],
      default: "pending"
    },
    completedAt: {
      type: Date,
      default: null
    },
    attachments: {
      type: [String],
      default: []
    },
    notes: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

leadTaskSchema.index({ lead: 1 });
leadTaskSchema.index({ assignedTo: 1 });
leadTaskSchema.index({ status: 1 });

export default mongoose.models.LeadTask || mongoose.model("LeadTask", leadTaskSchema);
