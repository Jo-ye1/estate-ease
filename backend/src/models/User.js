import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      default: null,
    },

      role: {
        type: String,
        enum: ["user", "buyer", "seller", "agency", "agent", "admin", "super_admin"],
        default: "user",
      },


    avatar: {
      type: String,
      default: "",
    },

    resetToken: {
      type: String,
      default: null,
    },

    resetTokenExpiry: {
      type: Date,
      default: null,
    },

    phone: {
      type: String,
      default: "",
    },

        // 🟢 MODULE 2: DELEGATED AGENT LINKING FIELDS
    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
      default: null,
    },

    commissionBalance: {
      type: Number,
      default: 0,
    },

    performanceScore: {
      type: Number,
      default: 100, // Starts at a perfect baseline score of 100
    },

    availabilityStatus: {
      type: String,
      enum: ["available", "busy", "offline"],
      default: "available",
    },

        // 🟢 MODULE 6: AGENT RANKING ENGINE STRUCTURAL METRICS
    dealCount: {
      type: Number,
      default: 0
    },
    reviewScore: {
      type: Number,
      default: 5.0 // Starts at a pristine 5-star baseline
    },
    responseTimeMinutes: {
      type: Number,
      default: 15 // Default baseline response expectation
    },
    trustBadge: {
      type: String,
      enum: ["none", "bronze", "silver", "gold", "platinum"],
      default: "none"
    },

    verificationStatus: {
      type: String,
      enum: ["unverified", "pending", "approved", "rejected"],
      default: "unverified"
    },
    idVerificationFile: {
      type: String,
      default: null
    },
    licenseVerificationFile: {
      type: String,
      default: null
    },
    businessVerificationFile: {
      type: String,
      default: null
    },
    kycReviewedAt: {
      type: Date,
      default: null
    }

  
    },
    {
    timestamps: true,
    }
  );

export default mongoose.model(
  "User",
  userSchema
);