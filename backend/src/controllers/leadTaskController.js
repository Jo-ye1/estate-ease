import mongoose from "mongoose";
import { getIO } from "../socket/socket.js"; 

export const getLeadTasks = async (req, res) => {
  try {
    const { id } = req.params;
    const LeadTaskModel = mongoose.models.LeadTask || mongoose.model("LeadTask");

    const tasks = await LeadTaskModel.find({ lead: id })
      .populate("assignedTo", "name email role")
      .sort({ dueDate: 1 });

    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createLeadTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, dueDate, assignedTo, taskType, eventType } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ message: "Missing required task fields parameters." });
    }

    const LeadModel = mongoose.models.Lead || mongoose.model("Lead");
    const LeadTaskModel = mongoose.models.LeadTask || mongoose.model("LeadTask");
    const AgentActivityModel = mongoose.models.AgentActivity || mongoose.model("AgentActivity");
    const CalendarEventModel = mongoose.models.CalendarEvent || mongoose.model("CalendarEvent");

    const lead = await LeadModel.findById(id);
    if (!lead) {
      return res.status(404).json({ message: "Target lead document not found." });
    }

    const task = await LeadTaskModel.create({
      lead: id,
      assignedTo: assignedTo || req.user._id,
      title,
      description,
      priority: priority || "medium",
      dueDate,
      taskType: taskType || "task"
    });

    await AgentActivityModel.create({
      agencyId: req.user.agencyId || lead.agencyId, 
      agentId: assignedTo || req.user._id,
      actionType: "task_created",
      title: `Task Created: ${title}`,
      description: description || `A new workspace operational assignment has been registered under client node ${lead.name}.`,
      relatedId: task._id,
      relatedType: "Task",
      metadata: { priority, dueDate }
    });

    const calendarEvent = await CalendarEventModel.create({
      agencyId: req.user.agencyId || lead.agencyId,
      createdBy: req.user._id,
      assignedTo: assignedTo || req.user._id,
      leadId: id,
      taskId: task._id,
      title,
      description: description || "",
      eventType: "task",
      startDate: dueDate,
      endDate: dueDate
    });

    const populatedTask = await LeadTaskModel.findById(task._id).populate("assignedTo", "name email role");

    try {
      const io = getIO();
      io.to(`agency_${req.user.agencyId || lead.agencyId}`).emit("calendar:update", calendarEvent);
    } catch (err) {
      console.error(err.message);
    }

    res.status(201).json({ success: true, task: populatedTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLeadTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const LeadTaskModel = mongoose.models.LeadTask || mongoose.model("LeadTask");
    const AgentActivityModel = mongoose.models.AgentActivity || mongoose.model("AgentActivity");
    const CalendarEventModel = mongoose.models.CalendarEvent || mongoose.model("CalendarEvent");

    const task = await LeadTaskModel.findById(id).populate("lead");
    if (!task) {
      return res.status(404).json({ message: "Target task document not found." });
    }

    const isMarkedCompletedNow = updates.status === "completed" && task.status !== "completed";

    if (updates.status === "completed" && task.status !== "completed") {
      updates.completedAt = new Date();
    } else if (updates.status && updates.status !== "completed") {
      updates.completedAt = null;
    }

    const updatedTask = await LeadTaskModel.findByIdAndUpdate(id, updates, { new: true })
      .populate("assignedTo", "name email role");

    if (isMarkedCompletedNow) {
      await AgentActivityModel.create({
        agencyId: req.user.agencyId || task.lead?.agencyId,
        agentId: task.assignedTo,
        actionType: "task_completed",
        title: `Task Completed: ${task.title}`,
        description: `Operational task has been successfully finalized by the assigned agent.`,
        relatedId: task._id,
        relatedType: "Task"
      });

      if (task.taskType === "meeting" || updates.taskType === "meeting" || updates.eventType === "meeting") {
        const meetingEvent = await CalendarEventModel.create({
          agencyId: req.user.agencyId || task.lead?.agencyId,
          createdBy: req.user._id,
          assignedTo: task.assignedTo,
          leadId: task.lead?._id || null,
          taskId: task._id,
          title: task.title,
          description: task.description || "",
          eventType: "meeting",
          status: "scheduled",
          startDate: task.dueDate,
          endDate: task.dueDate
        });

        try {
          const io = getIO();
          io.to(`agency_${req.user.agencyId || task.lead?.agencyId}`).emit("calendar:update", meetingEvent);
        } catch (err) {
          console.error(err.message);
        }
      }
    }

    res.json({ success: true, task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteLeadTask = async (req, res) => {
  try {
    const { id } = req.params;
    const LeadTaskModel = mongoose.models.LeadTask || mongoose.model("LeadTask");
    const CalendarEventModel = mongoose.models.CalendarEvent || mongoose.model("CalendarEvent");

    const task = await LeadTaskModel.findById(id).populate("lead");
    if (!task) {
      return res.status(404).json({ message: "Target task record not found." });
    }

    const agencyId = req.user.agencyId || task.lead?.agencyId;

    await CalendarEventModel.deleteMany({ taskId: id });
    await LeadTaskModel.findByIdAndDelete(id);

    try {
      const io = getIO();
      io.to(`agency_${agencyId}`).emit("calendar:update", { taskId: id, deleted: true });
    } catch (err) {
      console.error(err.message);
    }

    res.json({ success: true, message: "Pipeline follow-up task cleared successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
