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

    const UserModel = mongoose.model("User");
    const UserProfileModel = mongoose.model("UserProfile");

    await UserModel.findByIdAndUpdate(kycDoc.targetUser, {
      verificationStatus: status
    });

    await UserProfileModel.findOneAndUpdate(
      { user: kycDoc.targetUser },
      { 
        isIdentityVerified: status === "approved",
        isLicenseVerified: status === "approved"
      }
    );

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

export const submitUserKYCDocuments = async (req, res) => {
  try {
    const UserModel = mongoose.model("User");
    const { idFile, licenseFile, businessFile } = req.body;

    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User profile context not found." });
    }

    user.idVerificationFile = idFile || user.idVerificationFile;
    user.licenseVerificationFile = licenseFile || user.licenseVerificationFile;
    user.businessVerificationFile = businessFile || user.businessVerificationFile;
    user.verificationStatus = "pending";

    await user.save();

    await createNotification({
      type: "SYSTEM_WARNING",
      title: "New KYC Verification Task",
      message: `Account "${user.name}" (${user.role}) submitted verification credentials for compliance review.`,
      relatedId: user._id,
      relatedType: "User"
    });

    res.json({ success: true, message: "KYC credentials submitted successfully. Status updated to pending review.", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const evaluateKYCCompliance = async (req, res) => {
  try {
    const { targetUserId, action } = req.body; 
    const UserModel = mongoose.model("User");

    if (!["approved", "rejected"].includes(action)) {
      return res.status(400).json({ message: "Invalid verification state transition choice." });
    }

    const account = await UserModel.findById(targetUserId);
    if (!account) {
      return res.status(404).json({ message: "Target profile not found." });
    }

    account.verificationStatus = action;
    account.kycReviewedAt = new Date();
    await account.save();

    await createNotification({
      recipient: account._id,
      type: action === "approved" ? "ROLE_ESCALATION" : "SYSTEM_CRITICAL",
      title: action === "approved" ? "KYC Approved - Badge Earned" : "KYC Submission Rejected",
      message: action === "approved" 
        ? "Congratulations! Your background verification check passed successfully. A trust badge has been added to your profile."
        : "Compliance Update: Your background document details failed our safety guidelines. Please update your profile entries.",
      relatedId: account._id,
      relatedType: "User"
    });

    res.json({ success: true, message: `Account status updated to ${action} successfully.`, account });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Add this execution block right inside backend/src/controllers/kycController.js
export const submitNewKycTicket = async (req, res) => {
  try {
    const { documentType, licenseNumber, documentUrl } = req.body;
    const KycModel = mongoose.model("KycVerification");
    const AgencyModel = mongoose.model("Agency");

    if (!documentType || !licenseNumber || !documentUrl) {
      return res.status(400).json({ message: "Invalid payload parameters: Missing required KYC document elements." });
    }

    const linkedAgency = await AgencyModel.findOne({ ownerId: req.user._id });

    const kycTicket = await KycModel.create({
      targetUser: req.user._id,
      agencyReference: linkedAgency ? linkedAgency._id : null,
      documentType,
      licenseNumber,
      documentUrl,
      status: "pending"
    });

    res.status(201).json({ success: true, message: "KYC validation check documentation queued successfully.", kycTicket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
