import Property from "../models/Property.js";

export const getRecommendedProperties =
  async (req, res) => {
    try {
      const property =
        await Property.findById(
          req.params.id
        );

      if (!property) {
        return res.status(404).json({
          message: "Property not found",
        });
      }

      const recommendations =
        await Property.find({
          _id: {
            $ne: property._id,
          },

          location:
            property.location,

          propertyCategory:
            property.propertyCategory,

          listingType:
            property.listingType,
        }).limit(6);

      res.json(recommendations);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };