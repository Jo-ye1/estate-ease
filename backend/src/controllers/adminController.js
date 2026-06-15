import User from "../models/User.js";
import Property from "../models/Property.js";
import Lead from "../models/Lead.js";
import Favorite from "../models/Favorite.js";

export const getAdminSummaryDashboard = async (req, res) => {
  try {
    const [users, listings, leads] = await Promise.all([
      User.find({}).select("-password"),
      Property.find({}).populate("owner", "name email"),
      Lead.find({})
    ]);

    res.json({
      metrics: {
        globalUsersCount: users.length,
        globalListingsCount: listings.length,
        globalLeadsCount: leads.length,
      },
      users,
      listings,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const adminDeleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "super_admin") {
      return res.status(400).json({
        message: "Super admin cannot be deleted",
      });
    }

    await Property.deleteMany({
      owner: user._id,
    });

    await Favorite.deleteMany({
      user: user._id,
    });

    await Lead.deleteMany({
      $or: [
        { owner: user._id },
        { buyer: user._id }
      ]
    });

    await user.deleteOne();

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (
      user.role === "super_admin" &&
      role !== "super_admin"
    ) {
      return res.status(400).json({
        message: "Super admin cannot be demoted",
      });
    }

    user.role = role.toLowerCase().trim();

    await user.save();

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};