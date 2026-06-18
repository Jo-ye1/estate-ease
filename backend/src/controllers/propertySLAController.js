import PropertyAnalytics from "../models/PropertyAnalytics.js";

export const getPropertySLAMetrics =
  async (req, res) => {
    try {
      const analytics =
        await PropertyAnalytics.findOne({
          property: req.params.id,
        });

      if (!analytics) {
        return res.status(404).json({
          message: "Analytics not found",
        });
      }

      const timeToFirstLead =
        analytics.firstLeadAt
          ? analytics.firstLeadAt -
            analytics.createdAt
          : null;

      const timeToPublish =
        analytics.publishedAt &&
        analytics.approvalSubmittedAt
          ? analytics.publishedAt -
            analytics.approvalSubmittedAt
          : null;

      const timeToClose =
        analytics.closedAt &&
        analytics.publishedAt
          ? analytics.closedAt -
            analytics.publishedAt
          : null;

      res.json({
        timeToFirstLead,
        timeToPublish,
        timeToClose,
        daysOnMarket:
          analytics.daysOnMarket,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };