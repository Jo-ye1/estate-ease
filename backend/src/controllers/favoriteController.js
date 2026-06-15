import Favorite from "../models/Favorite.js";
import Property from "../models/Property.js";

export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({
      user: req.user._id,
    })
      .populate({
        path: "property",
        populate: {
          path: "owner",
          select: "name email avatar",
        },
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      favorites,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    const existing = await Favorite.findOne({
      user: req.user._id,
      property: propertyId,
    });

    if (existing) {
      return res.status(400).json({
        message: "Already favorited",
      });
    }

    const favorite = await Favorite.create({
      user: req.user._id,
      property: propertyId,
    });

    const populatedFavorite = await Favorite.findById(
      favorite._id
    ).populate({
      path: "property",
      populate: {
        path: "owner",
        select: "name email avatar",
      },
    });

    res.status(201).json({
      success: true,
      favorite: populatedFavorite,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;

    await Favorite.findOneAndDelete({
      user: req.user._id,
      property: propertyId,
    });

    const favorites = await Favorite.find({
      user: req.user._id,
    }).populate({
      path: "property",
      populate: {
        path: "owner",
        select: "name email avatar",
      },
    });

    res.json({
      success: true,
      favorites,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const existing = await Favorite.findOne({
      user: req.user._id,
      property: propertyId,
    });

    if (existing) {
      await existing.deleteOne();
    } else {
      const property = await Property.findById(propertyId);

      if (!property) {
        return res.status(404).json({
          message: "Property not found",
        });
      }

      await Favorite.create({
        user: req.user._id,
        property: propertyId,
      });
    }

    const favorites = await Favorite.find({
      user: req.user._id,
    }).populate({
      path: "property",
      populate: {
        path: "owner",
        select: "name email avatar",
      },
    });

    res.json({
      success: true,
      favorites,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
