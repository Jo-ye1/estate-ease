import mongoose from "mongoose";
import AuditLog from "../models/AuditLog.js";

export const getAuditLogs =
  async (req, res) => {
    try {
      const logs = await AuditLog.find({})
        .populate("actor", "name email")
        .sort({ createdAt: -1 })
        .limit(100);

      res.json(logs);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };



export const getPlatformGlobalAuditLedger = async (req, res) => {
  try {
    const AuditLogModel = mongoose.model("AuditLog");

    // Fetches the entire corporate system changelog stream, populating user details cleanly
    const logs = await AuditLogModel.find({})
      .populate("actor", "name email role")
      .sort({ createdAt: -1 })
      .limit(100); // Caps query output array buffer performance smoothly

    res.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
