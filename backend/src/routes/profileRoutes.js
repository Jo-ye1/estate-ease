import express from "express";
import mongoose from "mongoose";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import UserProfile from "../models/UserProfile.js"; 
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/v1/me", protect, async (req, res) => {
  try {
    const ProfileModel = mongoose.models.UserProfile || mongoose.model("UserProfile");
    const PropertyModel = mongoose.models.Property || null;
    const LeadModel = mongoose.models.Lead || null;
    const TaskModel = mongoose.models.LeadTask || null;

    let profile = await ProfileModel.findOne({ user: req.user._id })
      .populate("user", "name email avatar role verificationStatus availabilityStatus createdAt")
      .lean();

    if (!profile) {
      const baseName = req.user?.name || req.user?.email || "user";
      const extractPrefix = String(baseName).split("@");
      const sanitizedUsername = String(extractPrefix[0]).toLowerCase().replace(/[^a-z0-9]/g, "_");
      const generatedUsername = sanitizedUsername + "_" + String(req.user._id).slice(-4);

      const newProfileDoc = await ProfileModel.create({
        user: req.user._id,
        username: generatedUsername,
        location: "Global Matrix Node",
        bio: "Real estate professional calibrated on the EstateEase network.",
        languages: ["English"],
        specialization: ["Residential Brokerage"],
        coverageArea: ["Global Matrix Hub"],
        workingHours: "9:00 AM - 6:00 PM"
      });
      
      profile = await ProfileModel.findById(newProfileDoc._id)
        .populate("user", "name email avatar role verificationStatus availabilityStatus createdAt")
        .lean();
    }

    const properties = PropertyModel
      ? await PropertyModel.find({ owner: req.user._id }).lean().catch(() => [])
      : [];
      
    const totalLeads = LeadModel
      ? await LeadModel.countDocuments({
          $or: [{ assignedAgent: req.user._id }, { owner: req.user._id }]
        }).catch(() => 0)
      : 0;

    const wonLeads = LeadModel
      ? await LeadModel.countDocuments({
          $or: [{ assignedAgent: req.user._id }, { owner: req.user._id }],
          status: "won"
        }).catch(() => 0)
      : 0;

    const pendingTasks = TaskModel
      ? await TaskModel.countDocuments({
          assignedTo: req.user._id,
          status: "pending"
        }).catch(() => 0)
      : 0;

    const conversionRate = totalLeads === 0 ? 0 : Math.round((wonLeads / totalLeads) * 100);

    const finalProfile = {
      ...profile,
      businessStats: {
        agent: { propertiesManaged: properties.length, dealsClosed: wonLeads, revenueGenerated: wonLeads * 15000, conversionRate },
        seller: { propertiesListed: properties.length, propertiesSold: wonLeads, leadConversionRate: conversionRate },
        buyer: { savedPropertiesCount: 0, offersMadeCount: totalLeads, dealsCompletedCount: wonLeads }
      },
      isIdentityVerified: req.user?.verificationStatus === "approved",
      isLicenseVerified: req.user?.verificationStatus === "approved",
      isAgencyVerified: req.user?.verificationStatus === "approved"
    };

    return res.status(200).json({ success: true, profile: finalProfile, listings: properties, pendingTasks });
  } catch (error) {
    console.error("PROFILE ROUTE ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/v1/update-meta", protect, async (req, res) => {
  try {
    const ProfileModel = mongoose.models.UserProfile || mongoose.model("UserProfile");
    const UserModel = mongoose.models.User || mongoose.model("User");

    const profile = await ProfileModel.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ message: "Profile context missing." });

    const userAccount = await UserModel.findById(req.user._id);
    if (!userAccount) return res.status(404).json({ message: "User account context missing." });

    if (req.body.name !== undefined) userAccount.name = req.body.name;
    if (req.body.email !== undefined) userAccount.email = String(req.body.email).trim().toLowerCase();
    if (req.body.phone !== undefined) userAccount.phone = req.body.phone;
    await userAccount.save();

    const updatable = [
      "username", "coverImageUrl", "location", "agencyName", "bio", 
      "languages", "specialization", "coverageArea", "experienceYears", 
      "workingHours", "vacationMode"
    ];

    updatable.forEach(field => {
      if (req.body[field] !== undefined) profile[field] = req.body[field];
    });

    if (Array.isArray(profile.activityTimeline)) {
      profile.activityTimeline.push({
        actionType: "profile_updated",
        description: "Synchronized account metadata fields from edit module."
      });
    }

    await profile.save();
    
    const freshUser = await UserModel.findById(req.user._id).select("-password").lean();
    const finalPayload = { ...profile.toObject(), user: freshUser };

    if (req.io) {
      req.io.emit("profile:updated", finalPayload);
    }
    
    return res.json({ success: true, message: "Profile updated completely.", profile: finalPayload });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/v1/upload-media", protect, upload.single("image"), async (req, res) => {
  try {
    const ProfileModel = mongoose.models.UserProfile || mongoose.model("UserProfile");
    const UserModel = mongoose.models.User || mongoose.model("User");

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file provided for upload." });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const profile = await ProfileModel.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile context not found." });
    }

    const targetType = req.body.type || "cover"; 
    
    if (targetType === "avatar") {
      await UserModel.findByIdAndUpdate(req.user._id, { avatar: fileUrl });
    } else {
      profile.coverImageUrl = fileUrl;
    }

    if (Array.isArray(profile.activityTimeline)) {
      profile.activityTimeline.push({
        actionType: "media_updated",
        description: `Synchronized new account profile ${targetType} artwork asset parameters.`
      });
    }

    await profile.save();

    const freshUser = await UserModel.findById(req.user._id).select("-password").lean();
    const finalPayload = { ...profile.toObject(), user: freshUser };

    if (req.io) {
      req.io.emit("profile:updated", finalPayload);
    }

    return res.status(200).json({ 
      success: true, 
      message: "Media asset synchronized successfully inside backend clusters!", 
      url: fileUrl,
      profile: finalPayload 
    });

  } catch (error) {
    console.error("PROFILE MEDIA UPLOAD ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
