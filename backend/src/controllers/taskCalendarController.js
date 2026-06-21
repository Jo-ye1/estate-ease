import mongoose from "mongoose";

export const getTaskCalendar = async (req, res) => {
  try {
    const LeadTask = mongoose.model("LeadTask");

    const tasks = await LeadTask.find({
      assignedTo: req.user._id
    }).select("title dueDate status priority");

    const events = tasks.map((task) => ({
      id: task._id,
      title: task.title,
      date: task.dueDate,
      status: task.status,
      priority: task.priority
    }));

    res.json({
      success: true,
      events
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};