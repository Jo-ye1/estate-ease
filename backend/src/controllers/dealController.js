import mongoose from "mongoose";
import { createNotification } from "../utils/createNotification.js";
import { logAgentActivity } from "../utils/logAgentActivity.js";

export const createDeal = async (req, res) => {
  try {
    const Deal = mongoose.models.Deal || mongoose.model("Deal");

    const deal = await Deal.create(req.body);

    await logAgentActivity({
      agentId: deal.agentId,
      actionType: "deal_created",
      entityType: "Deal",
      entityId: deal._id,
      performedBy: req.user._id,
      metadata: {
        offerAmount: deal.offerAmount
      }
    });

    res.status(201).json({
      success: true,
      deal
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getDeals = async (req, res) => {
  try {
    const Deal = mongoose.models.Deal || mongoose.model("Deal");

    const deals = await Deal.find()
      .populate("buyerId sellerId agentId propertyId leadId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      deals
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getSingleDeal = async (req, res) => {
  try {
    const Deal = mongoose.models.Deal || mongoose.model("Deal");

    const deal = await Deal.findById(req.params.id)
      .populate("buyerId sellerId agentId propertyId leadId");

    if (!deal) {
      return res.status(404).json({
        message: "Deal not found"
      });
    }

    res.json({
      success: true,
      deal
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const updateDealStatus = async (req, res) => {
  try {
    const { dealStatus, finalAmount } = req.body;

    const Deal = mongoose.models.Deal || mongoose.model("Deal");

    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({
        message: "Deal not found"
      });
    }

    deal.dealStatus = dealStatus || deal.dealStatus;

    if (finalAmount) {
      deal.finalAmount = finalAmount;
    }

    if (dealStatus === "closed") {
      deal.closedAt = new Date();

      await logAgentActivity({
        agentId: deal.agentId,
        actionType: "deal_closed",
        entityType: "Deal",
        entityId: deal._id,
        performedBy: req.user._id,
        metadata: {
          finalAmount: deal.finalAmount
        }
      });

      await createNotification({
        recipient: deal.agentId,
        type: "DEAL_CLOSED",
        title: "Deal Closed",
        message: "A property deal has been successfully closed.",
        relatedId: deal._id,
        relatedType: "Deal"
      });

      const CommissionLog = mongoose.models.CommissionLog || mongoose.model("CommissionLog");

      const existingCommission = await CommissionLog.findOne({
        dealId: deal._id
      });

      if (!existingCommission) {
        const Agency = mongoose.models.Agency || mongoose.model("Agency");
        const AgentProfile = mongoose.models.AgentProfile || mongoose.model("AgentProfile");

        const agency = await Agency.findById(deal.agencyId);
        const agentProfile = await AgentProfile.findOne({
          userId: deal.agentId
        });

        const grossAmount = deal.finalAmount || deal.offerAmount;
        const platformFee = grossAmount * 0.02;
        const totalCommission = grossAmount * ((agency?.commissionRate || 5) / 100);

        const agentSplit =
          totalCommission *
          ((agentProfile?.commissionSplit || 60) / 100);

        const agencySplit =
          totalCommission - agentSplit;

        const commission = await CommissionLog.create({
          dealId: deal._id,
          agencyId: deal.agencyId,
          agentId: deal.agentId,
          grossAmount,
          platformFee,
          agencySplit,
          agentSplit
        });

        deal.commissionCalculated = true;
        deal.commissionLogId = commission._id;
      }
    }

    await deal.save();

    res.json({
      success: true,
      deal
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const deleteDeal = async (req, res) => {
  try {
    const Deal = mongoose.models.Deal || mongoose.model("Deal");

    await Deal.findByIdAndDelete(req.params.id);

    res.json({
      success: true
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
