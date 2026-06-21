import mongoose from "mongoose";

const agencyMessageSchema = new mongoose.Schema(
  {
    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
      required: true,
      index: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null // Null indicates a broadcast message visible to the entire agency roster
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    channelType: {
      type: String,
      enum: ["direct", "broadcast"],
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("AgencyMessage", agencyMessageSchema);
