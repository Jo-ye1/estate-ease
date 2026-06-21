import express from "express";
import bcrypt from "bcryptjs";
import { body } from "express-validator";
import { validate } from "../middleware/validationMiddleware.js";
import User from "../models/User.js";

import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  socialLogin,
} from "../controllers/authController.js";

import upload from "../middleware/uploadMiddleware.js";
import { submitUserKYCDocuments, evaluateKYCCompliance } from "../controllers/kycController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { submitUserReviewScore } from "../controllers/reviewController.js";


const router = express.Router();

/* =========================================================
   AUTH CORE
========================================================= */
router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  validate,
  registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password").notEmpty(),
  ],
  validate,
  loginUser
);

router.post("/social-login", socialLogin);

/* =========================================================
   PASSWORD RECOVERY FLOW
========================================================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = String(Math.floor(100000 + Math.random() * 900000));

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;

    await user.save();

    res.json({ success: true, resetToken: token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================================================
   PROTECTED USER SESSION
========================================================= */
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

router.post("/profile/kyc-submit", protect, submitUserKYCDocuments);
router.put("/admin/kyc-evaluate", protect, authorizeRoles("admin", "super_admin"), evaluateKYCCompliance);
router.post("/profile/submit-review", protect, authorizeRoles("user", "buyer"), submitUserReviewScore);


router.post(
  "/upload-avatar",
  protect,
  upload.single("image"),
  async (req, res) => {
    try {

      if (!req.file) {
          console.log("Upload failed: req.file missing");
          console.log(req.body);
      return res.status(400).json({
          message: "No file uploaded"
          });
      }

      const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { avatar: url },
        { new: true }
      ).select("-password");

      res.json({
        success: true,
        image: url,
        user
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

router.put("/update-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const match = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!match) {
      return res.status(400).json({
        message: "Current password incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({
      success: true,
      message: "Password updated",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});


router.put("/update-core", protect, async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email.trim().toLowerCase();
    if (phone !== undefined) user.phone = phone;

    await user.save();

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});



export default router;
