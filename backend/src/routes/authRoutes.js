import express from "express";
import { registerUser, loginUser, getMe, updateProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js"; 
import User from "../models/User.js"; // 👈 Changed from userModel.js to User.js

const router = express.Router();

// Public Authentication Endpoints
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected User Profile Endpoints
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

// @desc    Upload user profile avatar photo locally
// @route   POST /api/auth/upload-avatar
// @access  Private
router.post("/upload-avatar", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file snapshot uploaded" });
    }

    const localUrlPath = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: localUrlPath },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile avatar uploaded successfully!",
      image: localUrlPath,
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
