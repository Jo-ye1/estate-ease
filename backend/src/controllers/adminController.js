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
        .populate("owner", "name email")
        .populate("buyer", "name email")
        .populate("property", "title"),
    ]);

    // USERS GROWTH
    const monthlyUsersGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalUsers: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    // PROPERTY GROWTH
    const monthlyPropertyGrowth = await Property.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalProperties: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    // LEAD GROWTH
    const monthlyLeadGrowth = await Lead.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalLeads: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    // PROPERTY STATUS PIE
    const propertyStatusDistribution = await Property.aggregate([
      {
        $group: {
          _id: "$listingStatus",
          total: { $sum: 1 }
        }
      }
    ]);

    // USER ROLE DISTRIBUTION
    const roleDistribution = await User.aggregate([
      {
        $group: {
          _id: "$role",
          total: { $sum: 1 }
        }
      }
    ]);

    // LEAD FUNNEL
    const leadFunnel = await Lead.aggregate([
      {
        $group: {
          _id: "$status",
          total: { $sum: 1 }
        }
      }
    ]);

    const monthlyConversionTrend = await Lead.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          total: { $sum: 1 },
          closed: {
            $sum: {
              $cond: [{ $eq: ["$status", "closed"] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          conversionRate: {
            $multiply: [
              {
                $cond: [
                  { $eq: ["$total", 0] },
                  0,
                  { $divide: ["$closed", "$total"] }
                ]
              },
              100
            ]
          }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    // --- 0.4 Property Type Distribution ---
    const propertyTypeDistribution = await Property.aggregate([
      {
        $group: {
          _id: "$propertyCategory",
          total: { $sum: 1 }
        }
      }
    ]);

    // --- 0.5 Top Performing Properties ---
    const topPerformingProperties = await Lead.aggregate([
      {
        $group: {
          _id: "$property",
          totalLeads: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "properties",
          localField: "_id",
          foreignField: "_id",
          as: "property"
        }
      },
      {
        $unwind: "$property"
      },
      {
        $project: {
          title: "$property.title",
          totalLeads: 1
        }
      },
      {
        $sort: {
          totalLeads: -1
        }
      },
      {
        $limit: 5
      }
    ]);

    // --- 0.6 Recent Activities Feed ---
    const [recentUsers, recentProperties, recentLeads] = await Promise.all([
      User.find().sort({ createdAt: -1 }).limit(5).select("name email role createdAt"),
      Property.find().sort({ createdAt: -1 }).limit(5).select("title listingStatus price createdAt"),
      Lead.find().sort({ createdAt: -1 }).limit(5).populate("property", "title").select("status createdAt")
    ]);

    const recentActivities = [
      ...recentUsers.map(u => ({ type: "user", text: `New user registered: ${u.name} (${u.role})`, date: u.createdAt })),
      ...recentProperties.map(p => ({ type: "property", text: `New asset listed: ${p.title} (${p.listingStatus})`, date: p.createdAt })),
      ...recentLeads.map(l => ({ type: "lead", text: `New lead placement on: ${l.property?.title || "Unknown Asset"} (${l.status})`, date: l.createdAt }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    res.json({
      metrics: {
        globalUsersCount: users.length,
        globalListingsCount: listings.length,
        globalLeadsCount: leads.length,
      },
      users,
      listings,
      leads,

      monthlyUsersGrowth,
      monthlyPropertyGrowth,
      monthlyLeadGrowth,
      propertyStatusDistribution,
      roleDistribution,
      leadFunnel,
      monthlyConversionTrend,
      propertyTypeDistribution,
      topPerformingProperties,
      recentActivities
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

    // 🟢 AUDIT HOOK G: Log the user deletion BEFORE removing documents from the database
    await createAuditLog({
      actor: req.user._id,
      action: "USER_DELETED",
      targetType: "User",
      targetId: user._id,
    });

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

    // 🟢 AUDIT HOOK F: Log the user role change after saving the update
    await createAuditLog({
      actor: req.user._id,
      action: "ROLE_CHANGED",
      targetType: "User",
      targetId: user._id,
      metadata: {
        newRole: user.role,
      },
    });

    // 🟢 NOTIFICATION HOOK: Inform the user directly that their role has changed
    await createNotification({
      recipient: user._id,
      sender: req.user._id,
      type: "ROLE_CHANGED",
      title: "Role Updated",
      message: `Your role is now ${role}`,
      relatedId: user._id,
      relatedType: "User",
    });

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



export const getSuperAdminAnalytics = async (req, res) => {
  try {
    // 👑 0.7 Global System Health Count Matrices
    const [
      totalUsers,
      totalAdmins,
      totalOwners,
      totalBuyers,
      totalProperties,
      totalLeads,
      totalFavorites
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "owner" }),
      User.countDocuments({ role: "user" }), // or your distinct "buyer" criteria
      Property.countDocuments({}),
      Lead.countDocuments({}),
      User.aggregate([
        { $project: { count: { $size: { $ifNull: ["$favorites", []] } } } },
        { $group: { _id: null, total: { $sum: "$count" } } }
      ]).then(res => res[0]?.total || 0)
    ]);

    // 👑 0.8 Global Role Distribution Slices
    const roleDistribution = await User.aggregate([
      {
        $group: {
          _id: "$role",
          total: { $sum: 1 }
        }
      }
    ]);

    // 👑 0.9 Platform Growth Timeline (Unified System Matrix)
    const [monthlyUsersGrowth, monthlyPropertyGrowth, monthlyLeadGrowth] = await Promise.all([
      User.aggregate([
        { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, total: { $sum: 1 } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]),
      Property.aggregate([
        { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, total: { $sum: 1 } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]),
      Lead.aggregate([
        { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, total: { $sum: 1 } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ])
    ]);

    res.status(200).json({
      systemHealth: {
        totalUsers,
        totalAdmins,
        totalOwners,
        totalBuyers,
        totalProperties,
        totalLeads,
        totalFavorites
      },
      roleDistribution,
      platformGrowth: {
        users: monthlyUsersGrowth,
        properties: monthlyPropertyGrowth,
        leads: monthlyLeadGrowth
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

