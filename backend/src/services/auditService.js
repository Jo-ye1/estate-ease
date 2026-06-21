import mongoose from "mongoose";

export const createAuditLog = async ({
  actor,
  action,
  targetType,
  targetId,
  metadata = {}
}) => {
  try {
    const AuditLogModel = mongoose.model("AuditLog");

    const logEntry = await AuditLogModel.create({
      actor,
      action,
      targetType,
      targetId,
      metadata: {
        ...metadata,
        systemTimestamp: new Date().toISOString()
      }
    });

    return logEntry;
  } catch (err) {
    console.error("🔥 [CRITICAL SECURITY LEDGER LOGGER REGISTRY EXCEPTION]:", err.message);
    return null;
  }
};
