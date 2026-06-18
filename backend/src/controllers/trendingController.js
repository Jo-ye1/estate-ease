import PropertyAnalytics from "../models/PropertyAnalytics.js";

export const getTrendingProperties = async (
  req,
  res
) => {
  try {
    const trending =
      await PropertyAnalytics.aggregate([
        {
          $addFields: {
            score: {
              $add: [
                "$views",
                "$favorites",
                "$leadRequests",
              ],
            },
          },
        },
        {
          $sort: {
            score: -1,
          },
        },
        {
          $limit: 10,
        },
        {
          $lookup: {
            from: "properties",
            localField: "property",
            foreignField: "_id",
            as: "propertyData",
          },
        },
        {
          $unwind: "$propertyData",
        },
      ]);

    res.json(trending);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};