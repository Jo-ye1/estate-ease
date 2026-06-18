import AuditLog from "../models/AuditLog.js";

export const createAuditLog = async ({
  actor,
  action,
  targetType,
  targetId,
  metadata = {},
}) => {
  try {
    await AuditLog.create({
      actor,
      action,
      targetType,
      targetId,
      metadata,
    });
  } catch (error) {
    console.error(
      "Audit log failed:",
      error.message
    );
  }
};