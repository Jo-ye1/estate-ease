import RecentlyViewed from "../models/RecentlyViewed.js";

export const trackRecentlyViewed =
  async (req, res) => {
    try {
      const { propertyId } = req.body;

      const existing =
        await RecentlyViewed.findOne({
          user: req.user._id,
          property: propertyId,
        });

      if (existing) {
        existing.lastViewedAt =
          new Date();

        await existing.save();
      } else {
        await RecentlyViewed.create({
          user: req.user._id,
          property: propertyId,
        });
      }

      res.json({
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const getRecentlyViewed =
  async (req, res) => {
    try {
      const history =
        await RecentlyViewed.find({
          user: req.user._id,
        })
          .populate("property")
          .sort({
            lastViewedAt: -1,
          })
          .limit(10);

      res.json(history);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };