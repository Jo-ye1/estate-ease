import SavedSearch from "../models/SavedSearch.js";

export const createSavedSearch = async (req, res) => {
  try {
    const search = await SavedSearch.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json(search);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMySavedSearches = async (req, res) => {
  try {
    const searches = await SavedSearch.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(searches);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteSavedSearch = async (req, res) => {
  try {
    await SavedSearch.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};