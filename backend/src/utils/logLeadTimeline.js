import mongoose from "mongoose";

export const logLeadTimeline = async ({ lead, actor, action, description, metadata = {} }) => {
  try {
    const LeadTimelineModel = mongoose.model("LeadTimeline");
    await LeadTimelineModel.create({
      lead,
      actor,
      action,
      description,
      metadata
    });
  } catch (err) {
    console.error("Timeline track write bypassed:", err.message);
  }
};
