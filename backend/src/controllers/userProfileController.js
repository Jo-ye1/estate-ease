import mongoose from "mongoose";

export const getUniversalProfileContext = async (req, res) => {
  try {
    const ProfileModel = mongoose.model("UserProfile");
    const { identifier } = req.params; // Can pass username or full Mongoose document Object ID

    let query = { username: identifier };
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      query = { $or: [{ user: identifier }, { _id: identifier }] };
    }

    const profile = await ProfileModel.findOne(query)
      .populate("user", "name email role availabilityStatus createdAt")
      .populate("reviews.reviewer", "name email");

    if (!profile) {
      return res.status(404).json({ message: "Requested universal profile context data structure not found." });
    }

    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUniversalProfileData = async (req, res) => {
  try {
    const ProfileModel = mongoose.model("UserProfile");
    let profile = await ProfileModel.findOne({ user: req.user._id });

    if (!profile) {
      profile = new ProfileModel({ user: req.user._id });
    }

    const updatableFields = [
      "username", "coverImageUrl", "location", "agencyName", "bio",
      "languages", "specialization", "coverageArea", "experienceYears",
      "workingHours", "vacationMode"
    ];

    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    profile.activityTimeline.push({
      actionType: "profile_updated",
      description: "Updated universal account profile meta configurations."
    });

    await profile.save();
    res.json({ success: true, message: "Universal profile settings updated successfully.", profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
