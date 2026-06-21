import mongoose from "mongoose";

export const getMyWorkspaceTasks = async (req, res) => {
  try {
    const LeadTask = mongoose.model("LeadTask");

    const tasks = await LeadTask.find({
      assignedTo: req.user._id
    })
      .populate("lead")
      .populate("assignedTo", "name email role")
      .sort({ dueDate: 1 });

    res.json({
      success: true,
      tasks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAgencyWorkspaceTasks = async (req, res) => {
  try {
    const LeadTask = mongoose.model("LeadTask");
    const Lead = mongoose.model("Lead");
    const Agency = mongoose.model("Agency");

    const agency = await Agency.findOne({
      ownerId: req.user._id
    });

    if (!agency) {
      return res.status(404).json({ message: "Agency not found." });
    }

    const leads = await Lead.find({
      owner: req.user._id
    }).select("_id");

    const leadIds = leads.map((l) => l._id);

    const tasks = await LeadTask.find({
      lead: { $in: leadIds }
    })
      .populate("lead")
      .populate("assignedTo", "name email role")
      .sort({ dueDate: 1 });

    res.json({
      success: true,
      tasks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTaskAnalytics = async (req, res) => {
  try {
    const LeadTask = mongoose.model("LeadTask");

    const tasks = await LeadTask.find({
      assignedTo: req.user._id
    });

    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const pending = tasks.filter((t) => t.status === "pending").length;
    const inProgress = tasks.filter((t) => t.status === "in_progress").length;
    const overdue = tasks.filter(
      (t) =>
        t.status !== "completed" &&
        t.status !== "cancelled" &&
        new Date(t.dueDate) < new Date()
    ).length;

    const completionRate =
      total > 0 ? ((completed / total) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      analytics: {
        total,
        completed,
        pending,
        inProgress,
        overdue,
        completionRate
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};