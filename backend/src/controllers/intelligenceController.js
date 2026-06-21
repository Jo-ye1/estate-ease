import SearchLog from "../models/SearchLog.js";
import PropertyAnalytics from "../models/PropertyAnalytics.js";
import Property from "../models/Property.js";

export const getSearchHeatmap =
  async (req, res) => {
    try {
      const topCities =
        await SearchLog.aggregate([
          {
            $group: {
              _id: "$location",
              total: { $sum: 1 },
            },
          },
          {
            $sort: {
              total: -1,
            },
          },
          {
            $limit: 10,
          },
        ]);

      const topCategories =
        await SearchLog.aggregate([
          {
            $group: {
              _id: "$category",
              total: { $sum: 1 },
            },
          },
          {
            $sort: {
              total: -1,
            },
          },
          {
            $limit: 10,
          },
        ]);

      const topOperations =
        await SearchLog.aggregate([
          {
            $group: {
              _id: "$operation",
              total: { $sum: 1 },
            },
          },
          {
            $sort: {
              total: -1,
            },
          },
        ]);

      res.json({
        topCities,
        topCategories,
        topOperations,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };


  export const getDemandTrends =
  async (req, res) => {
    try {
      const topBedrooms =
        await SearchLog.aggregate([
          {
            $group: {
              _id: "$bedrooms",
              total: { $sum: 1 },
            },
          },
          {
            $sort: {
              total: -1,
            },
          },
        ]);

      const topPriceRanges =
        await SearchLog.aggregate([
          {
            $project: {
              priceBand: {
                $concat: [
                  { $toString: "$minPrice" },
                  "-",
                  { $toString: "$maxPrice" },
                ],
              },
            },
          },
          {
            $group: {
              _id: "$priceBand",
              total: { $sum: 1 },
            },
          },
          {
            $sort: {
              total: -1,
            },
          },
        ]);

      res.json({
        topBedrooms,
        topPriceRanges,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

  export const getBehaviorAnalytics =
  async (req, res) => {
    try {
      const mostViewed =
        await PropertyAnalytics.find()
          .populate("property", "title")
          .sort({ views: -1 })
          .limit(10);

      const mostFavorited =
        await PropertyAnalytics.find()
          .populate("property", "title")
          .sort({ favorites: -1 })
          .limit(10);

      const mostContacted =
        await PropertyAnalytics.find()
          .populate("property", "title")
          .sort({ leadRequests: -1 })
          .limit(10);

      res.json({
        mostViewed,
        mostFavorited,
        mostContacted,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };


  export const getMarketIntelligence =
  async (req, res) => {
    try {
      const avgPriceByCity =
        await Property.aggregate([
          {
            $group: {
              _id: "$location",
              avgSalePrice: {
                $avg: "$pricing.salePrice",
              },
              totalInventory: {
                $sum: 1,
              },
            },
          },
          {
            $sort: {
              totalInventory: -1,
            },
          },
        ]);

      const monthlyInventoryGrowth =
        await Property.aggregate([
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
              },
              totalProperties: {
                $sum: 1,
              },
            },
          },
          {
            $sort: {
              "_id.year": 1,
              "_id.month": 1,
            },
          },
        ]);

      res.json({
        avgPriceByCity,
        monthlyInventoryGrowth,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };


  export const getPriceSuggestion =
  async (req, res) => {
    try {
      const {
        location,
        propertyCategory,
        bedrooms,
        listingType,
      } = req.body;

      const comparableProperties =
        await Property.find({
          location,
          propertyCategory,
          bedrooms,
          listingType,
          listingStatus: {
            $in: ["published", "sold"],
          },
        });

      if (
        comparableProperties.length === 0
      ) {
        return res.json({
          suggestedPrice: null,
          marketAverage: null,
          competitionCount: 0,
          message:
            "No comparable properties found",
        });
      }

      let prices = [];

      comparableProperties.forEach(
        (property) => {
          if (listingType === "sale") {
            prices.push(
              property.pricing?.salePrice || 0
            );
          }

          if (listingType === "rent") {
            prices.push(
              property.pricing?.monthlyRent || 0
            );
          }

          if (listingType === "hotel") {
            prices.push(
              property.pricing?.dailyRate || 0
            );
          }
        }
      );

      const total =
        prices.reduce(
          (sum, price) => sum + price,
          0
        );

      const marketAverage =
        total / prices.length;

      const suggestedPrice =
        Math.round(
          marketAverage * 1.03
        );

      res.json({
        suggestedPrice,
        marketAverage,
        competitionCount:
          comparableProperties.length,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };