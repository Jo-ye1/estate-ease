import mongoose from "mongoose";
import { createNotification } from "../utils/createNotification.js";
import { logAgentActivity } from "../utils/logAgentActivity.js";

export const taskOverdueCron = async () => {
  try {
    const LeadTask = mongoose.model("LeadTask");

    const overdueTasks = await LeadTask.find({
      status: { $nin: ["completed", "cancelled"] },
      dueDate: { $lt: new Date() }
    });

    for (const task of overdueTasks) {
      task.status = "cancelled";
      await task.save();

      await createNotification({
        recipient: task.assignedTo,
        type: "TASK_OVERDUE",
        title: "Task Overdue",
        message: `Task "${task.title}" is overdue.`,
        relatedId: task._id,
        relatedType: "LeadTask"
      });

      await logAgentActivity({
        agentId: task.assignedTo,
        actionType: "task_overdue",
        referenceId: task._id,
        referenceType: "LeadTask"
      });
    }

    console.log(`Overdue tasks checked: ${overdueTasks.length}`);
  } catch (error) {
    console.error(error.message);
  }
};