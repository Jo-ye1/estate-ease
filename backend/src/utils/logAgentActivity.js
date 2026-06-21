import AgentActivity from "../models/AgentActivity.js";

export const logAgentActivity = async ({
  agencyId,
  agentId,
  actionType,
  title,
  description = "",
  relatedId = null,
  relatedType = null,
  metadata = {}
}) => {
  try {
    await AgentActivity.create({
      agencyId,
      agentId,
      actionType,
      title,
      description,
      relatedId,
      relatedType,
      metadata
    });
  } catch (error) {
    console.error("Agent Activity Log Error:", error.message);
  }
};