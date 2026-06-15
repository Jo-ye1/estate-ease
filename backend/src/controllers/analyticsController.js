import Lead from "../models/Lead.js";

export const getDashboardAnalytics = async (
  req,
  res
) => {
  try {
    const totalLeads =
      await Lead.countDocuments();

    const convertedLeads =
      await Lead.countDocuments({
        status: "closed",
      });

    const conversionRate =
      totalLeads > 0
        ? (
            (convertedLeads / totalLeads) *
            100
          ).toFixed(2)
        : 0;

    const topProperties =
      await Lead.aggregate([
        {
          $group: {
            _id: "$property",
            totalLeads: { $sum: 1 },
          },
        },
        { $sort: { totalLeads: -1 } },
        { $limit: 5 },
      ]);

    const ownerPerformance =
      await Lead.aggregate([
        {
          $group: {
            _id: "$owner",
            totalLeads: { $sum: 1 },
          },
        },
        { $sort: { totalLeads: -1 } },
      ]);

    res.json({
      totalLeads,
      convertedLeads,
      conversionRate,
      topProperties,
      ownerPerformance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};