import mongoose from "mongoose";

const leadNoteSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

leadNoteSchema.index({ lead: 1 });
leadNoteSchema.index({ createdAt: -1 });

export default mongoose.model("LeadNote", leadNoteSchema);
