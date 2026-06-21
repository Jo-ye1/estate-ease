import mongoose from "mongoose";

const kycVerificationSchema = new mongoose.Schema(
  {
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    agencyReference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
      default: null
    },
    documentType: {
      type: String,
      enum: ["corporate_license", "agent_credentials", "identity_passport", "tax_filing"],
      required: true
    },
    licenseNumber: {
      type: String,
      required: true,
      trim: true
    },
    documentUrl: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    rejectionReason: {
      type: String,
      default: ""
    },
    reviewedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

kycVerificationSchema.index({ status: 1 });
kycVerificationSchema.index({ targetUser: 1 });

export default mongoose.model("KycVerification", kycVerificationSchema);
