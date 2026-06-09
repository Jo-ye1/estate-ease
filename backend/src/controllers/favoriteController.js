import User from "../models/User.js";

// @desc    Get logged in user's favorite properties
// @route   GET /api/favorites
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.favorites || []);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Add a property to favorites
// @route   POST /api/favorites/:propertyId
export const addFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert ObjectIds to strings to accurately verify duplicates
    const isAlreadyFavorite = user.favorites.some(
      (fav) => fav.toString() === req.params.propertyId
    );

    if (isAlreadyFavorite) {
      return res.status(400).json({
        message: "Property is already in favorites",
      });
    }

    user.favorites.push(req.params.propertyId);
    await user.save();

    res.json({
      message: "Added to favorites",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Remove a property from favorites
// @route   DELETE /api/favorites/:propertyId
export const removeFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter out the requested property ID out of the User array reference
    user.favorites = user.favorites.filter(
      (fav) => fav.toString() !== req.params.propertyId
    );

    await user.save();

    res.json({
      message: "Removed from favorites",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
