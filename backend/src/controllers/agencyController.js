import mongoose from "mongoose";
import Agency from "../models/Agency.js";
import AgentProfile from "../models/AgentProfile.js";
import User from "../models/User.js";
import Lead from "../models/Lead.js";
import { createNotification } from "../utils/createNotification.js";
import { getIO, getReceiverSocket } from "../socket/socket.js";

export const getAgencyTeam = async (req, res) => {
  try {
    const agency = await Agency.findOne({
      ownerId: req.user.id
    });

    if (!agency) {
      return res.status(404).json({
        message: "Agency not found"
      });
    }

    const team = await AgentProfile.find({
      agencyId: agency._id
    })
      .populate("userId", "name email avatar role");

    const enrichedTeam = await Promise.all(
      team.map(async (agent) => {
        const assignedLeads = await Lead.countDocuments({
          assignedAgent: agent.userId._id
        });

        return {
          ...agent.toObject(),
          assignedLeads
        };
      })
    );

    res.json(enrichedTeam);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const updateAgentAvailability = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { availability } = req.body;

    const agent = await AgentProfile.findByIdAndUpdate(
      agentId,
      { availability },
      { new: true }
    );

    res.json(agent);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const registerAgencyBrokerage = async (req, res) => {
  try {
    const { name, licenseNumber, commissionRate } = req.body;
    const AgencyModel = mongoose.model("Agency");
    const UserModel = mongoose.model("User");

    const existingAgency = await AgencyModel.findOne({
      $or: [{ ownerId: req.user._id }, { licenseNumber }],
    });

    if (existingAgency) {
      return res.status(400).json({ message: "Agency registry conflict: Profile or license already registered." });
    }

    const agency = await AgencyModel.create({
      name,
      licenseNumber,
      commissionRate: commissionRate || 5.0,
      ownerId: req.user._id,
      agents: [],
    });

    await UserModel.findByIdAndUpdate(req.user._id, { role: "agency" });

    await createNotification({
      type: "NEW_SELLER_REGISTERED",
      title: "New Agency Onboarded",
      message: `Brokerage firm "${name}" (License: ${licenseNumber}) has joined the platform ecosystem.`,
      relatedId: agency._id,
      relatedType: "Agency",
    });

    res.status(201).json({ success: true, message: "Agency brokerage firm onboarded successfully.", agency });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const inviteAndOnboardSubAgent = async (req, res) => {
  try {
    const { agentEmail } = req.body;
    const AgencyModel = mongoose.model("Agency");
    const UserModel = mongoose.model("User");

    const agency = await AgencyModel.findOne({ ownerId: req.user._id });
    if (!agency) {
      return res.status(403).json({ message: "Forbidden: Only registered Agency owners can add team members." });
    }

    const targetUser = await UserModel.findOne({ email: agentEmail });
    if (!targetUser) {
      return res.status(404).json({ message: "User profile not found with the provided email address." });
    }

    if (targetUser.agencyId) {
      return res.status(400).json({ message: "Conflict: This user is already linked to an active brokerage firm." });
    }

    const protectedRoles = ["admin", "super_admin", "agency"];
    if (protectedRoles.includes(targetUser.role)) {
      return res.status(400).json({ message: "Forbidden: Cannot downgrade or override executive/brokerage role accounts." });
    }

    targetUser.role = "agent";
    targetUser.agencyId = agency._id;
    await targetUser.save();

    await AgentProfile.create({
      userId: targetUser._id,
      agencyId: agency._id
    });

    agency.agents.push(targetUser._id);
    await agency.save();

    await createNotification({
      recipient: targetUser._id,
      type: "ROLE_ESCALATION",
      title: "Joined Corporate Brokerage",
      message: `You have been added as an official field agent for "${agency.name}". Check your workspace panel.`,
      relatedId: agency._id,
      relatedType: "Agency"
    });

    const io = getIO();
    const receiverSocket = getReceiverSocket(targetUser._id.toString());
    if (receiverSocket) {
      io.to(receiverSocket).emit("role_escalated", {
        newRole: "agent",
        agencyId: agency._id
      });
    }

    res.json({
      success: true,
      message: `Agent ${targetUser.name} has been successfully onboarded into your team roster matrix.`,
      agent: {
        id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
