import User from "../models/UserModel.js";
import Property from "../models/PropertyModel.js";

// @desc    Fetch all platform accounts and complete system statistics metrics
// @route   GET /api/admin/dashboard-summary
// @access  Private/Admin
export const getAdminSummaryDashboard = async (req, res) => {
  try {
    const [usersList, listingsList] = await Promise.all([
      User.find({}).select("-password"), // Exclude passwords from return payload for compliance safety
      Property.find({}).populate("owner", "name email")
    ]);

    res.json({
      metrics: {
        globalUsersCount: usersList.length,
        globalListingsCount: listingsList.length,
      },
      users: usersList,
      listings: listingsList
    });
  } catch (error) {
    res.status(500).json({ message: `Administrative Summary Fetch Crashed: ${error.message}` });
  }
};

// @desc    Permanently delete any user account out from platform data structures
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const adminDeleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User account document not found" });
    
    if (user.role === "admin") {
      return res.status(400).json({ message: "Safety Protection Triggered: Master Admins cannot be deleted." });
    }

    // Cascade delete: automatically purge all listings associated with this owner account
    await Property.deleteMany({ owner: user._id });
    await user.deleteOne();

    res.json({ message: "Account profile and all associated listing assets successfully purged from system." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Modify a user account's platform role privileges dynamically
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    if (!role) {
      return res.status(400).json({ message: "Role value parameter is strictly required." });
    }

    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({ message: "User account document not found." });
    }

    // Safety fallback: Guard against accidental de-elevation of yourself or the master user
    if (targetUser.email === "1234567890@gmail.com" && role !== "admin") {
      return res.status(400).json({ message: "Security Protocol: Primary system root administrator cannot be demoted." });
    }

    targetUser.role = role.toLowerCase().trim();
    await targetUser.save();

    res.json({
      message: `Account role updated successfully to ${role}!`,
      user: { _id: targetUser._id, name: targetUser.name, email: targetUser.email, role: targetUser.role }
    });
  } catch (error) {
    res.status(500).json({ message: `Administrative update execution failed: ${error.message}` });
  }
};
