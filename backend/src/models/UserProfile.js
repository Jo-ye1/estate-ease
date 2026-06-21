import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    username: { type: String, unique: true, sparse: true, trim: true },
    coverImageUrl: { type: String, default: "" },
    location: { type: String, default: "" },
    agencyName: { type: String, default: "" },
    
    // Bio Section parameters
    bio: { type: String, default: "" },
    languages: [{ type: String }],
    specialization: [{ type: String }],
    coverageArea: [{ type: String }],
    experienceYears: { type: Number, default: 0 },
    workingHours: { type: String, default: "9:00 AM - 6:00 PM" },
    vacationMode: { type: Boolean, default: false },

    // Trust Profile verification metrics
    trustScore: { type: Number, default: 70, min: 0, max: 100 },
    isIdentityVerified: { type: Boolean, default: false },
    isLicenseVerified: { type: Boolean, default: false },
    isAgencyVerified: { type: Boolean, default: false },

    // Multi-Role Integrated Business Statistics Sub-Nodes
    businessStats: {
      agent: {
        propertiesManaged: { type: Number, default: 0 },
        dealsClosed: { type: Number, default: 0 },
        revenueGenerated: { type: Number, default: 0 },
        commissionEarned: { type: Number, default: 0 },
        conversionRate: { type: Number, default: 0 },
        avgResponseMinutes: { type: Number, default: 0 },
        rankingIndex: { type: Number, default: 0 }
      },
      seller: {
        propertiesListed: { type: Number, default: 0 },
        propertiesSold: { type: Number, default: 0 },
        avgResponseMinutes: { type: Number, default: 0 },
        leadConversionRate: { type: Number, default: 0 }
      },
      buyer: {
        savedPropertiesCount: { type: Number, default: 0 },
        offersMadeCount: { type: Number, default: 0 },
        dealsCompletedCount: { type: Number, default: 0 }
      }
    },

    // Immutable System Activity Timeline Array Stream
    activityTimeline: [
      {
        actionType: { type: String, required: true },
        description: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],

    // Vaulted Media Attachments & Document URL arrays
    vaultedDocuments: [
      {
        title: { type: String, required: true },
        docUrl: { type: String, required: true },
        category: { type: String, enum: ["contract", "certificate", "license", "document", "image"], required: true }
      }
    ],

    // Trust Reviews Matrix Array Stream Node
    reviews: [
      {
        reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reviewerName: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        feedbackType: { type: String, enum: ["client", "seller", "agency"], required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

//userProfileSchema.index({ user: 1 });
userProfileSchema.index({ username: 1 }, { unique: true, sparse: true });

export default mongoose.model("UserProfile", userProfileSchema);
