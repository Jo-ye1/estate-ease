import mongoose from "mongoose";

const agencySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
      default: null,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    agents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    activeListingsCount: {
      type: Number,
      default: 0,
    },
    commissionRate: {
      type: Number,
      default: 5.0, 
    },

    officeAddress: {
  type: String,
  default: ""
},

phone: {
  type: String,
  default: ""
},

email: {
  type: String,
  default: ""
},

description: {
  type: String,
  default: ""
},

isActive: {
  type: Boolean,
  default: true
},
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Agency", agencySchema);
