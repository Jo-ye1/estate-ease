import mongoose from "mongoose";

export const createTaskComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { message, attachments } = req.body;

    const TaskComment = mongoose.model("TaskComment");

    const comment = await TaskComment.create({
      taskId,
      authorId: req.user._id,
      message,
      attachments: attachments || []
    });

    res.status(201).json({
      success: true,
      comment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTaskComments = async (req, res) => {
  try {
    const { taskId } = req.params;
    const TaskComment = mongoose.model("TaskComment");

    const comments = await TaskComment.find({
      taskId
    }).populate("authorId", "name email role");

    res.json({
      success: true,
      comments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};