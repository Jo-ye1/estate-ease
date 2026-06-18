import PropertyAnalytics from "../models/PropertyAnalytics.js";
import Property from "../models/Property.js";

export const getOwnerPropertyAnalytics =
  async (req, res) => {
    try {
      const ownerId = req.user._id;

      const ownerProperties =
        await Property.find({
          owner: ownerId,
        }).select("_id");

      const propertyIds =
        ownerProperties.map((p) => p._id);

      const analytics =
        await PropertyAnalytics.find({
          property: {
            $in: propertyIds,
          },
        }).populate(
          "property",
          "title listingType listingStatus"
        );

      res.json(analytics);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };