import mongoose from "mongoose";

const FollowUpSchema =
  new mongoose.Schema(
    {
      lead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead",
      },

      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      nextFollowUp: Date,

      status: {
        type: String,
        enum: [
          "pending",
          "completed",
          "missed",
        ],
        default: "pending",
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "FollowUp",
  FollowUpSchema
);