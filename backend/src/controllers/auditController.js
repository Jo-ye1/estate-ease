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