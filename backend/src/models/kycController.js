import mongoose from "mongoose";
import { createNotification } from "../utils/createNotification.js";

export const getPendingKycSubmissions = async (req, res) => {
  try {
    const KycModel = mongoose.model("KycVerification");
    const submissions = await KycModel.find({ status: "pending" })
      .populate("targetUser", "name email role")
      .populate("agencyReference", "name licenseNumber")
      .sort({ createdAt: 1 });

    res.json({ success: true, submissions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reviewKycSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid evaluation review parameters status flag." });
    }

    const KycModel = mongoose.model("KycVerification");
    const kycDoc = await KycModel.findById(id);
    if (!kycDoc) {
      return res.status(404).json({ message: "KYC validation check ticket records not found." });
    }

    kycDoc.status = status;
    kycDoc.rejectionReason = reason || "";
    kycDoc.reviewedBy = req.user._id;
    kycDoc.reviewedAt = new Date();
    await kycDoc.save();

    await createNotification({
      recipient: kycDoc.targetUser,
      type: "ROLE_ESCALATION",
      title: status === "approved" ? "KYC Verification Cleared" : "KYC Validation Refused",
      message: status === "approved" 
        ? "Your corporate brokerage license verification check passed security audits successfully." 
        : `Your validation credentials ticket was refused. Reason: ${reason || "Failed document criteria check guidelines."}`,
      relatedId: kycDoc._id,
      relatedType: "KycVerification"
    });

    res.json({ success: true, message: `KYC submission marked ${status} and saved successfully.`, kycDoc });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
