import mongoose from "mongoose";
import { createNotification } from "../utils/createNotification.js";
import { logAgentActivity } from "../utils/logAgentActivity.js";

export const generateCommissionLedger = async (req, res) => {
  try {
    const Deal = mongoose.model("Deal");
    const CommissionLog = mongoose.model("CommissionLog");
    const Agency = mongoose.model("Agency");
    const AgentProfile = mongoose.model("AgentProfile");

    const deal = await Deal.findById(req.params.dealId);

    if (!deal) {
      return res.status(404).json({
        message: "Deal not found"
      });
    }

    if (deal.commissionCalculated) {
      return res.status(400).json({
        message: "Commission already generated"
      });
    }

    const agency = await Agency.findById(deal.agencyId);
    const agentProfile = await AgentProfile.findOne({
      userId: deal.agentId
    });

    const grossAmount = deal.finalAmount || deal.offerAmount;
    const platformFee = grossAmount * 0.02;
    const totalCommission = grossAmount * (agency.commissionRate / 100);

    const agentSplit =
      totalCommission * ((agentProfile?.commissionSplit || 60) / 100);

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

    await deal.save();

    await createNotification({
      recipient: deal.agentId,
      type: "COMMISSION_CREATED",
      title: "Commission Generated",
      message: "A new commission entry has been created.",
      relatedId: commission._id,
      relatedType: "CommissionLog"
    });

    await logAgentActivity({
      agentId: deal.agentId,
      actionType: "commission_created",
      entityType: "CommissionLog",
      entityId: commission._id,
      performedBy: req.user._id
    });

    res.status(201).json({
      success: true,
      commission
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getAllCommissions = async (req, res) => {
  try {
    const CommissionLog = mongoose.model("CommissionLog");

    const commissions = await CommissionLog.find()
      .populate("dealId agencyId agentId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      commissions
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getSingleCommission = async (req, res) => {
  try {
    const CommissionLog = mongoose.model("CommissionLog");

    const commission = await CommissionLog.findById(req.params.id)
      .populate("dealId agencyId agentId");

    res.json({
      success: true,
      commission
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const markCommissionPaid = async (req, res) => {
  try {
    const CommissionLog = mongoose.model("CommissionLog");

    const commission = await CommissionLog.findById(req.params.id);

    commission.payoutStatus = "paid";
    commission.payoutDate = new Date();

    await commission.save();

    await createNotification({
      recipient: commission.agentId,
      type: "COMMISSION_PAID",
      title: "Commission Paid",
      message: "Your commission has been paid.",
      relatedId: commission._id,
      relatedType: "CommissionLog"
    });

    await logAgentActivity({
      agentId: commission.agentId,
      actionType: "commission_paid",
      entityType: "CommissionLog",
      entityId: commission._id,
      performedBy: req.user._id
    });

    res.json({
      success: true,
      commission
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getMyAgentCommissions = async (req, res) => {
  try {
    const CommissionLog = mongoose.model("CommissionLog");

    const commissions = await CommissionLog.find({
      agentId: req.user._id
    });

    res.json({
      success: true,
      commissions
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getMyAgencyCommissions = async (req, res) => {
  try {
    const Agency = mongoose.model("Agency");
    const CommissionLog = mongoose.model("CommissionLog");

    const agency = await Agency.findOne({
      ownerId: req.user._id
    });

    const commissions = await CommissionLog.find({
      agencyId: agency._id
    });

    res.json({
      success: true,
      commissions
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const executeDealCommissionSplit = async (req, res) => {
  try {
    const { leadId, totalDealValue, agentSplitRate } = req.body;

    if (!leadId || !totalDealValue) {
      return res.status(400).json({ message: "Invalid payload: Missing leadId or totalDealValue parameters." });
    }

    const AgencyModel = mongoose.model("Agency");
    const LeadModel = mongoose.model("Lead");

    const agency = await AgencyModel.findOne({
      $or: [{ ownerId: req.user._id }, { agents: req.user._id }]
    });

    if (!agency) {
      return res.status(404).json({ message: "Brokerage agency context profile not found." });
    }

    const lead = await LeadModel.findById(leadId);
    if (!lead) {
      return res.status(404).json({ message: "Target lead document not found." });
    }

    const companyRate = agency.commissionRate || 5.0;
    const grossCommission = (totalDealValue * companyRate) / 100;
    
    const rateAgent = agentSplitRate || 50.0;
    const agentCut = (grossCommission * rateAgent) / 100;
    const agencyCut = grossCommission - agentCut;

    const RevenueModel = mongoose.models.Revenue || mongoose.model("Revenue", new mongoose.Schema({}, { strict: false }));
    
    const commissionRecord = await RevenueModel.create({
      lead: lead._id,
      agency: agency._id,
      agent: lead.assignedAgent || lead.owner,
      totalDealValue,
      grossCommission,
      agentCut,
      agencyCut,
      status: "cleared",
      processedAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: "Deal financial commission split executed and recorded successfully.",
      data: commissionRecord
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};