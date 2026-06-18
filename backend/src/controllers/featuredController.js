import Property from "../models/Property.js";

export const featureProperty =
  async (req, res) => {
    try {
      const property =
        await Property.findById(
          req.params.id
        );

      property.isFeatured =
        true;

      property.featuredUntil =
        new Date(
          Date.now() +
            7 *
              24 *
              60 *
              60 *
              1000
        );

      await property.save();

      res.json(property);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };