import mongoose from "mongoose";

const commissionLogSchema = new mongoose.Schema(
  {
    dealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deal",
      required: true
    },

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

    grossAmount: {
      type: Number,
      required: true
    },

    platformFee: {
      type: Number,
      default: 0
    },

    agencySplit: {
      type: Number,
      default: 0
    },

    agentSplit: {
      type: Number,
      default: 0
    },

    payoutStatus: {
      type: String,
      enum: ["pending", "paid", "escrow", "withdrawn", "disputed"],
      default: "pending"
    },

    payoutDate: {
      type: Date,
      default: null
    },

    invoice: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

commissionLogSchema.index({ dealId: 1 });
commissionLogSchema.index({ agencyId: 1 });
commissionLogSchema.index({ agentId: 1 });
commissionLogSchema.index({ payoutStatus: 1 });

export default mongoose.model("CommissionLog", commissionLogSchema);