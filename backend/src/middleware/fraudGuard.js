import mongoose from "mongoose";
import { createNotification } from "../utils/createNotification.js";

export const enforceLeadAntiSpamGuard = async (req, res, next) => {
  try {
    const LeadModel = mongoose.model("Lead");
    const FraudAlertModel = mongoose.model("FraudAlert");
    const userId = req.user._id;

    const sixtySecondsAgo = new Date(Date.now() - 60 * 1000);
    
    const rapidLeadsCount = await LeadModel.countDocuments({
      user: userId,
      createdAt: { $gte: sixtySecondsAgo }
    });

    if (rapidLeadsCount >= 3) {
      const alert = await FraudAlertModel.create({
        userId,
        triggerType: "LEAD_SPAM",
        riskScore: 85,
        actionTaken: "AUTO_FLAG",
        evidenceMetadata: {
          ipAddress: req.ip,
          attemptsCount: rapidLeadsCount,
          userAgent: req.headers["user-agent"]
        }
      });

      await createNotification({
        type: "LEAD_ABUSE_ALERT",
        title: "Malicious Lead Activity Blocked",
        message: `Account ID "${userId}" was auto-flagged for executing rapid lead submission bursts. Actions are temporarily locked.`,
        relatedId: alert._id,
        relatedType: "FraudAlert"
      });

      return res.status(429).json({
        message: "Security Notice: Excessive transaction requests. Your submissions are locked down due to suspected automation bot abuse rules."
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyListingDuplicateFilter = async (req, res, next) => {
  try {
    const PropertyModel = mongoose.model("Property");
    const FraudAlertModel = mongoose.model("FraudAlert");
    const { title, location } = req.body;

    if (!title || !location) return next();

    const identicalListing = await PropertyModel.findOne({
      title: { $regex: `^${title.trim()}$`, $options: "i" },
      location: { $regex: `^${location.trim()}$`, $options: "i" },
      listingStatus: { $ne: "archived" }
    });

    if (identicalListing) {
      const alert = await FraudAlertModel.create({
        userId: req.user._id,
        triggerType: "DUPLICATE_LISTING",
        riskScore: 70,
        actionTaken: "MANUAL_REVIEW",
        evidenceMetadata: {
          duplicatePropertyId: identicalListing._id,
          matchedTitle: title,
          matchedLocation: location
        }
      });

      await createNotification({
        type: "PROPERTY_FLAGGED",
        title: "Duplicate Upload Blocked",
        message: `A listing upload was blocked for matching an active marketplace item title and location coordinate profile.`,
        relatedId: alert._id,
        relatedType: "FraudAlert"
      });

      return res.status(409).json({
        message: "Compliance Block: An identical property listing with this name and location profile already exists live on our marketplace."
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
