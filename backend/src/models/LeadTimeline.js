import mongoose from "mongoose";

const leadTimelineSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    action: {
      type: String,
      enum: [
        "Lead Created",
        "Lead Assigned",
        "Stage Changed",
        "Viewing Scheduled",
        "Offer Sent",
        "Contract Signed"
      ],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

leadTimelineSchema.index({ lead: 1 });
leadTimelineSchema.index({ createdAt: -1 });

export default mongoose.model("LeadTimeline", leadTimelineSchema);
