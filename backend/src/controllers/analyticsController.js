import Lead from "../models/Lead.js";
import Property from "../models/Property.js";
import Favorite from "../models/Favorite.js"; // 🟢 ADDED THIS IMPORT AT THE TOP

export const getDashboardAnalytics = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();

    const convertedLeads = await Lead.countDocuments({
      status: "won",
    });

    const conversionRate =
      totalLeads > 0
        ? Number(((convertedLeads / totalLeads) * 100).toFixed(2))
        : 0;

    const leadFunnel = await Lead.aggregate([
      {
        $group: {
          _id: "$status",
          total: { $sum: 1 },
        },
      },
    ]);

    const topProperties = await Lead.aggregate([
      {
        $group: {
          _id: "$property",
          totalLeads: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "properties",
          localField: "_id",
          foreignField: "_id",
          as: "property",
        },
      },
      {
        $unwind: "$property",
      },
      {
        $project: {
          _id: "$property._id",
          title: "$property.title",
          totalLeads: 1,
        },
      },
      { $sort: { totalLeads: -1 } },
      { $limit: 5 },
    ]);

    const ownerPerformance = await Lead.aggregate([
      {
        $group: {
          _id: "$owner",
          totalLeads: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $unwind: "$owner",
      },
      {
        $project: {
          _id: "$owner._id",
          name: "$owner.name",
          totalLeads: 1,
        },
      },
      { $sort: { totalLeads: -1 } },
    ]);

    res.json({
      totalLeads,
      convertedLeads,
      conversionRate,
      leadFunnel, 
      topProperties,
      ownerPerformance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getOwnerAnalytics = async (req, res) => {
  try {
    const ownerId = req.user._id;

    // 🟢 THE FIX STEP 1: Count total properties currently belonging to this owner
    const totalListings = await Property.countDocuments({ owner: ownerId });

    const totalLeads = await Lead.countDocuments({
      owner: ownerId,
    });

    const convertedLeads = await Lead.countDocuments({
      owner: ownerId,
      status: "won",
    });

    const conversionRate =
      totalLeads > 0
        ? Number(((convertedLeads / totalLeads) * 100).toFixed(2))
        : 0;

    // 🟢 THE FIX STEP 2: Calculate only real favorite records by verifying the property still exists on disk
    const favoritesData = await Favorite.aggregate([
      {
        $lookup: {
          from: "properties",
          localField: "property",
          foreignField: "_id",
          as: "propertyDetails"
        }
      },
      {
        $unwind: "$propertyDetails"
      },
      {
        $match: {
          "propertyDetails.owner": ownerId
        }
      },
      {
        $count: "total"
      }
    ]);

    const totalFavorites = favoritesData.length > 0 ? favoritesData[0].total : 0;

    const leadFunnel = await Lead.aggregate([
      {
        $match: {
          owner: ownerId,
        },
      },
      {
        $group: {
          _id: "$status",
          total: { $sum: 1 },
        },
      },
    ]);

    const topProperties = await Lead.aggregate([
      {
        $match: {
          owner: ownerId,
        },
      },
      {
        $group: {
          _id: "$property",
          totalLeads: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "properties",
          localField: "_id",
          foreignField: "_id",
          as: "property",
        },
      },
      {
        $unwind: "$property",
      },
      {
        $project: {
          _id: "$property._id",
          title: "$property.title",
          totalLeads: 1,
          listingType: "$property.listingType",
          pricing: "$property.pricing",
          listingStatus: "$property.listingStatus",
        },
      },
      {
        $sort: {
          totalLeads: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);

    let totalRevenue = 0;

    topProperties.forEach((property) => {
      if (property.listingStatus === "sold" || property.listingStatus === "closed") {
        if (property.listingType === "sale") {
          totalRevenue += property.pricing?.salePrice || 0;
        }

        if (property.listingType === "rent") {
          totalRevenue += property.pricing?.monthlyRent || 0;
        }

        if (property.listingType === "hotel") {
          totalRevenue += property.pricing?.dailyRate || 0;
        }
      }
    });

    const monthlyLeadGrowth = await Lead.aggregate([
      {
        $match: {
          owner: ownerId,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalLeads: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const monthlyConversions = await Lead.aggregate([
      {
        $match: {
          owner: ownerId,
          status: "won", 
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          converted: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const propertyStatusDistribution = await Property.aggregate([
      {
        $match: {
          owner: ownerId,
        },
      },
      {
        $group: {
          _id: "$listingStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    const monthlyConversionTrend = await Lead.aggregate([
      {
        $match: {
          owner: ownerId,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          total: { $sum: 1 },
          closed: {
            $sum: {
              $cond: [{ $eq: ["$status", "won"] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          conversionRate: {
            $multiply: [
              {
                $cond: [
                  { $eq: ["$total", 0] },
                  0,
                  { $divide: ["$closed", "$total"] }
                ]
              },
              100
            ]
          }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    res.json({
      totalListings, // 🟢 Passed total active listings
      totalLeads,
      convertedLeads,
      conversionRate,
      totalFavorites, // 🟢 Passed calculated favorite count
      leadFunnel, 
      topProperties,
      totalRevenue,
      monthlyLeadGrowth,
      monthlyConversions,
      propertyStatusDistribution,
      monthlyConversionTrend,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
