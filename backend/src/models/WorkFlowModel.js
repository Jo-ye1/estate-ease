import mongoose from "mongoose";

const WorkflowStepSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  iconName: { type: String, default: "Search" }, // Stores lucide icon string lookup key
  tag: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true }
});

const WorkflowSchema = new mongoose.Schema({
  heroBadge: { type: String, default: "OPERATIONAL FRAMEWORK" },
  heroTitle: { type: String, default: "Understanding the Estate Ease Engine" },
  heroDesc: { type: String, default: "We have eliminated the traditional friction from real-estate interactions." },
  ctaTitle: { type: String, default: "Ready to try it live?" },
  ctaDesc: { type: String, default: "Skip the manual documentation pipelines." },
  sectionBadge: { type: String, default: "OUR WORKFLOW" },
  sectionTitle: { type: String, default: "How It Works" },
  steps: [WorkflowStepSchema]
}, { timestamps: true });

export default mongoose.model("Workflow", WorkflowSchema);
