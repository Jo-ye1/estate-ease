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



export const getSmartAIRecommendations = async (req, res) => {
  try {
    const PropertyModel = mongoose.model("Property");
    const FavoriteModel = mongoose.model("Favorite");
    const SearchLogModel = mongoose.model("SearchLog");

    const userId = req.user._id;

    const userFavorites = await FavoriteModel.find({ user: userId }).populate("property");
    const userSearchHistory = await SearchLogModel.find({ user: userId }).sort({ createdAt: -1 }).limit(10);

    let favoriteCategories = [];
    let favoriteLocations = [];
    let favoritePriceRange = { min: 0, max: Infinity };

    userFavorites.forEach(fav => {
      if (fav.property) {
        if (fav.property.propertyCategory) favoriteCategories.push(fav.property.propertyCategory);
        if (fav.property.location) favoriteLocations.push(fav.property.location);
      }
    });

    userSearchHistory.forEach(log => {
      if (log.category) favoriteCategories.push(log.category);
      if (log.location) favoriteLocations.push(log.location);
      if (log.minPrice && log.minPrice < favoritePriceRange.max) favoritePriceRange.min = log.minPrice;
      if (log.maxPrice && log.maxPrice > favoritePriceRange.min) favoritePriceRange.max = log.maxPrice;
    });

    const primaryCategory = favoriteCategories.length > 0 
      ? favoriteCategories.sort((a,b) => favoriteCategories.filter(v => v===a).length - favoriteCategories.filter(v => v===b).length).pop()
      : "house";

    const primaryLocation = favoriteLocations.length > 0
      ? favoriteLocations.sort((a,b) => favoriteLocations.filter(v => v===a).length - favoriteLocations.filter(v => v===b).length).pop()
      : null;

    let intelligenceQuery = {
      listingStatus: "published",
      isExpired: false,
      owner: { $ne: userId }
    };

    if (primaryCategory) intelligenceQuery.propertyCategory = primaryCategory;
    if (primaryLocation) {
      intelligenceQuery.location = { $regex: primaryLocation.split(",")[0], $options: "i" };
    }

    let recommendedListings = await PropertyModel.find(intelligenceQuery)
      .sort({ boostScore: -1, isFeatured: -1, createdAt: -1 })
      .limit(6)
      .populate("owner", "name email avatar");

    if (recommendedListings.length < 3) {
      recommendedListings = await PropertyModel.find({
        listingStatus: "published",
        isExpired: false,
        owner: { $ne: userId }
      })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("owner", "name email avatar");
    }

    res.json({
      success: true,
      strategy: primaryLocation ? "Collaborative Spatial Metric Filter" : "Fallback Global Feed Velocity Split",
      recommendations: recommendedListings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
