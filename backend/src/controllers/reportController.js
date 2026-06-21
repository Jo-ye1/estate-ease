import mongoose from "mongoose";

import mongoose from "mongoose";
import {
  calculateConversionRate,
  calculateClosingSpeed,
  calculateLeadSourceQuality
} from "../services/intelligenceService.js";

export const getPipelineReport = async (req, res) => {
  try {
    const Lead = mongoose.model("Lead");

    const agencyId = req.user.agencyId;

    const report = await Lead.aggregate([
      { $match: { agencyId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      report
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCommissionDashboard = async (req, res) => {
  try {
    const Commission = mongoose.model("CommissionLog");

    const agencyId = req.user.agencyId;

    const summary = await Commission.aggregate([
      { $match: { agencyId } },
      {
        $group: {
          _id: "$status",
          total: { $sum: "$amount" }
        }
      }
    ]);

    res.json({
      success: true,
      summary
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAgencyHealthScore = async (req, res) => {
  try {
    const agencyId = req.user.agencyId;

    const conversionRate = await calculateConversionRate(agencyId);
    const closingSpeed = await calculateClosingSpeed(agencyId);
    const leadQuality = await calculateLeadSourceQuality(agencyId);

    const score =
      (conversionRate * 0.4) +
      (100 - closingSpeed * 2) +
      (leadQuality.reduce((a, b) => a + b.quality, 0) / (leadQuality.length || 1));

    res.json({
      success: true,
      score,
      conversionRate,
      closingSpeed,
      leadQuality
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getForecastEngine = async (req, res) => {
  try {
    const Deal = mongoose.model("Deal");

    const forecast = await Deal.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" }
          },
          revenue: { $sum: "$finalAmount" }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    res.json({
      success: true,
      forecast
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRevenueReport = async (req, res) => {
  const CommissionLog = mongoose.model("CommissionLog");

  const totalRevenue = await CommissionLog.aggregate([
    {
      $group: {
        _id: null,
        total: {
          $sum: "$grossAmount"
        }
      }
    }
  ]);

  res.json(totalRevenue);
};

export const getDealReport = async (req, res) => {
  const Deal = mongoose.model("Deal");

  const deals = await Deal.aggregate([
    {
      $group: {
        _id: "$dealStatus",
        total: {
          $sum: 1
        }
      }
    }
  ]);

  res.json(deals);
};

export const getCommissionReport = async (req, res) => {
  const CommissionLog = mongoose.model("CommissionLog");

  const commissions = await CommissionLog.aggregate([
    {
      $group: {
        _id: "$payoutStatus",
        total: {
          $sum: "$agentSplit"
        }
      }
    }
  ]);

  res.json(commissions);
};

export const getAgentLeaderboard = async (req, res) => {
  const AgentProfile = mongoose.model("AgentProfile");

  const leaderboard = await AgentProfile.find()
    .sort({ totalRevenueGenerated: -1 })
    .limit(10)
    .populate("userId", "name");

  res.json(leaderboard);
};