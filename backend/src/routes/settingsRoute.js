import express from "express";
import mongoose from "mongoose";

const router = express.Router();

const FooterSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "global_footer",
    },
    footerText: {
      type: String,
      default:
        "Nemo enim ipsam voluptatem quia voluptas sit aspernatur...",
    },
    facebookUrl: {
      type: String,
      default: "https://facebook.com",
    },
    linkedinUrl: {
      type: String,
      default: "https://linkedin.com",
    },
    twitterUrl: {
      type: String,
      default: "https://twitter.com",
    },
    instagramUrl: {
      type: String,
      default: "https://instagram.com",
    },
  },
  {
    timestamps: true,
  }
);

const FooterSettings =
  mongoose.models.FooterSettings ||
  mongoose.model(
    "FooterSettings",
    FooterSettingsSchema
  );

router.get("/footer", async (req, res) => {
  try {
    let settings = await FooterSettings.findOne({
      key: "global_footer",
    });

    if (!settings) {
      settings = await FooterSettings.create({
        key: "global_footer",
      });
    }

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch footer settings",
    });
  }
});

router.post("/footer", async (req, res) => {
  try {
    const {
      footerText,
      facebookUrl,
      linkedinUrl,
      twitterUrl,
      instagramUrl,
    } = req.body;

    const updated = await FooterSettings.findOneAndUpdate(
      { key: "global_footer" },
      {
        footerText,
        facebookUrl,
        linkedinUrl,
        twitterUrl,
        instagramUrl,
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({
      error: "Failed to update footer settings",
    });
  }
});

export default router;