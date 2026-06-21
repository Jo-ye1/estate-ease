import mongoose from "mongoose";
import { getIO, getReceiverSocket } from "../socket/socket.js";

export const sendInternalAgencyMessage = async (req, res) => {
  try {
    const { text, recipientId, channelType } = req.body;
    const AgencyModel = mongoose.model("Agency");
    const UserModel = mongoose.model("User");
    const AgencyMessageModel = mongoose.model("AgencyMessage");

    const senderProfile = req.user;
    let targetAgencyId = senderProfile.agencyId;

    if (senderProfile.role === "agency") {
      const managedAgency = await AgencyModel.findOne({ ownerId: senderProfile._id });
      if (managedAgency) targetAgencyId = managedAgency._id;
    }

    if (!targetAgencyId) {
      return res.status(403).json({ message: "Forbidden: You must belong to a brokerage to access internal channels." });
    }

    const message = await AgencyMessageModel.create({
      agencyId: targetAgencyId,
      senderId: senderProfile._id,
      recipientId: channelType === "broadcast" ? null : recipientId,
      text,
      channelType
    });

    const io = getIO();

    if (channelType === "broadcast") {
      const corporateFirm = await AgencyModel.findById(targetAgencyId);
      const teamMates = [...(corporateFirm?.agents || []), corporateFirm?.ownerId];
      
      teamMates.forEach(memberId => {
        if (memberId.toString() !== senderProfile._id.toString()) {
          const sock = getReceiverSocket(memberId.toString());
          if (sock) io.to(sock).emit("internalAgencyBroadcast", message);
        }
      });
    } else if (recipientId) {
      const recipientSocket = getReceiverSocket(recipientId.toString());
      if (recipientSocket) io.to(recipientSocket).emit("internalAgencyDirectMessage", message);
    }

    res.status(201).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInternalAgencyFeed = async (req, res) => {
  try {
    const { opponentId, channelType } = req.query;
    const AgencyModel = mongoose.model("Agency");
    const AgencyMessageModel = mongoose.model("AgencyMessage");

    const userProfile = req.user;
    let targetAgencyId = userProfile.agencyId;

    if (userProfile.role === "agency") {
      const managedAgency = await AgencyModel.findOne({ ownerId: userProfile._id });
      if (managedAgency) targetAgencyId = managedAgency._id;
    }

    if (!targetAgencyId) {
      return res.status(403).json({ message: "Forbidden: Access to internal data is locked." });
    }

    let filterQuery = { agencyId: targetAgencyId, channelType };

    if (channelType === "direct" && opponentId) {
      filterQuery.$or = [
        { senderId: userProfile._id, recipientId: opponentId },
        { senderId: opponentId, recipientId: userProfile._id }
      ];
      delete filterQuery.channelType;
      filterQuery.channelType = "direct";
    }

    const chatHistory = await AgencyMessageModel.find(filterQuery)
      .populate("senderId", "name role")
      .sort({ createdAt: 1 });

    res.json(chatHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
