const express = require("express");
const router = express.Router();
const AboutSettings = require("../models/AboutSettings");


// @route   GET /api/about-settings
// @desc    Fetch the single master layout configuration document
router.get("/", async (req, res) => {
  try {
    let settings = await AboutSettings.findOne();
    if (!settings) {
      // If collection is blank, initialize a base fallback document instantly
      settings = await AboutSettings.create({});
    }
    return res.json(settings);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/about-settings
// @desc    Upsert/Update the master layout parameters configuration document
router.post("/", async (req, res) => {
  try {
    let settings = await AboutSettings.findOne();
    if (!settings) {
      settings = new AboutSettings(req.body);
    } else {
      // Overwrite document fields with incoming payload values directly
      Object.assign(settings, req.body);
    }
    await settings.save();
    return res.json({ message: "MongoDB Atlas About settings synchronized safely!", settings });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
