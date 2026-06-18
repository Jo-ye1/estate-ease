import Property from "../models/Property.js";
import { logRevenue } from "../services/revenueService.js";

export const boostProperty =
  async (req, res) => {
    try {
      const property =
        await Property.findById(
          req.params.id
        );

      property.boostScore =
        100;

      property.boostExpiresAt =
        new Date(
          Date.now() +
            3 *
              24 *
              60 *
              60 *
              1000
        );

      await property.save();

      await logRevenue({
        user: property.owner,
        property: property._id,
        type: "boost",
        amount: 49,
        source: "featured",
      });

      res.json(property);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };
