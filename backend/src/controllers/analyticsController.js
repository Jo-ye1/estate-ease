import Lead from "../models/Lead.js";
import Property from "../models/Property.js";
import Favorite from "../models/Favorite.js";
import mongoose from "mongoose";

export const getDashboardAnalytics = async (req, res) => {
  try {
    const CalendarEventModel = mongoose.models.CalendarEvent || mongoose.model("CalendarEvent");

    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const endOfToday = new Date(now.setHours(23, 59, 59, 999));

    const totalLeads = await Lead.countDocuments();

    const convertedLeads = await Lead.countDocuments({
      status: "won",
    });

    const conversionRate =
      totalLeads > 0
        ? Number(((convertedLeads / totalLeads) * 100).toFixed(2))
        : 0;

    const [
      todayEventsCount,
      upcomingMeetingsCount,
      missedMeetingsCount,
      completedMeetingsCount,
      propertyVisitsCount,
      followUpsCount,
      leadFunnel,
      topProperties,
      ownerPerformance
    ] = await Promise.all([
      CalendarEventModel.countDocuments({ startDate: { $gte: startOfToday, $lte: endOfToday } }),
      CalendarEventModel.countDocuments({ eventType: "meeting", status: "scheduled", startDate: { $gt: new Date() } }),
      CalendarEventModel.countDocuments({ status: "missed" }),
      CalendarEventModel.countDocuments({ eventType: "meeting", status: "completed" }),
      CalendarEventModel.countDocuments({ eventType: "property_visit" }),
      CalendarEventModel.countDocuments({ eventType: "follow_up" }),
      
      Lead.aggregate([
        {
          $group: {
            _id: "$status",
            total: { $sum: 1 },
          },
        },
      ]),

      Lead.aggregate([
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
      ]),

      Lead.aggregate([
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
      ])
    ]);

    res.json({
      totalLeads,
      convertedLeads,
      conversionRate,
      leadFunnel, 
      topProperties,
      ownerPerformance,
      widgets: {
        todayEventsCount,
        upcomingMeetingsCount,
        missedMeetingsCount,
        completedMeetingsCount,
        propertyVisitsCount,
        followUpsCount
      }
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
    const CalendarEventModel = mongoose.models.CalendarEvent || mongoose.model("CalendarEvent");

    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const endOfToday = new Date(now.setHours(23, 59, 59, 999));

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

    const [
      todayEventsCount,
      upcomingMeetingsCount,
      missedMeetingsCount,
      completedMeetingsCount,
      propertyVisitsCount,
      followUpsCount,
      favoritesData,
      leadFunnel,
      topProperties,
      monthlyLeadGrowth,
      monthlyConversions,
      propertyStatusDistribution,
      monthlyConversionTrend
    ] = await Promise.all([
      CalendarEventModel.countDocuments({ createdBy: ownerId, startDate: { $gte: startOfToday, $lte: endOfToday } }),
      CalendarEventModel.countDocuments({ createdBy: ownerId, eventType: "meeting", status: "scheduled", startDate: { $gt: new Date() } }),
      CalendarEventModel.countDocuments({ createdBy: ownerId, status: "missed" }),
      CalendarEventModel.countDocuments({ createdBy: ownerId, eventType: "meeting", status: "completed" }),
      CalendarEventModel.countDocuments({ createdBy: ownerId, eventType: "property_visit" }),
      CalendarEventModel.countDocuments({ createdBy: ownerId, eventType: "follow_up" }),

      Favorite.aggregate([
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
      ]),

      Lead.aggregate([
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
      ]),

      Lead.aggregate([
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
      ]),

      Lead.aggregate([
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
      ]),

      Lead.aggregate([
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
      ]),

      Property.aggregate([
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
      ]),

      Lead.aggregate([
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
      ])
    ]);

    const totalFavorites = favoritesData.length > 0 ? favoritesData[0].total : 0;

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

    res.json({
      totalListings, 
      totalLeads,
      convertedLeads,
      conversionRate,
      totalFavorites, 
      leadFunnel, 
      topProperties,
      totalRevenue,
      monthlyLeadGrowth,
      monthlyConversions,
      propertyStatusDistribution,
      monthlyConversionTrend,
      widgets: {
        todayEventsCount,
        upcomingMeetingsCount,
        missedMeetingsCount,
        completedMeetingsCount,
        propertyVisitsCount,
        followUpsCount
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
