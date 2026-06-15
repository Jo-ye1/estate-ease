const mongoose = require("mongoose");

const AboutSettingsSchema = new mongoose.Schema({
  // Section 1: Core Intro Copy
  heading: { type: String, default: "About the Estate Ease Engine" },
  subheading: { type: String, default: "Redefining real-estate ecosystems." },
  paragraph: { type: String, default: "Full company background context narrative goes here..." },
  heroImage: { type: String, default: "" }, // Permanent image storage path string

  // Section 2: Core Milestone Statistics Badges
  stats: [
    {
      value: { type: String, default: "12+" },
      label: { type: String, default: "Years Active" }
    }
  ],

  // Section 3: Foundation Standards Tiers
  pillars: [
    {
      title: { type: String, default: "Absolute Transparency" },
      text: { type: String, default: "Metrics description content..." }
    }
  ],

  // Section 4: Expanded Corporate History Timeline Track
  history: [
    {
      year: { type: String, default: "2024" },
      title: { type: String, default: "Platform Conception" },
      body: { type: String, default: "Initial registry code matrix initialization..." }
    }
  ],

  // Section 5: Expert Advisory Council Matrix Array
  advisors: [
    {
      name: { type: String, default: "Awaiting Update" },
      role: { type: String, default: "Executive Board Advisor" },
      tag: { type: String, default: "COUNCIL" },
      linkedin: { type: String, default: "https://linkedin.com" },
      image: { type: String, default: "" }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("AboutSettings", AboutSettingsSchema);
