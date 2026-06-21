import mongoose from "mongoose";

const dealSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true
    },

    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true
    },

    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
      default: null
    },

    offerAmount: {
      type: Number,
      required: true
    },

    finalAmount: {
      type: Number,
      default: 0
    },

    dealStatus: {
      type: String,
      enum: [
        "offer_submitted",
        "negotiation",
        "contract_sent",
        "contract_signed",
        "payment_pending",
        "closed",
        "cancelled"
      ],
      default: "offer_submitted"
    },

    contractFile: {
      type: String,
      default: ""
    },

    commissionCalculated: {
      type: Boolean,
      default: false
    },

    commissionLogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommissionLog",
      default: null
    },

    notes: [
      {
        body: String,
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    closedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

dealSchema.index({ propertyId: 1 });
dealSchema.index({ leadId: 1 });
dealSchema.index({ agentId: 1 });
dealSchema.index({ agencyId: 1 });
dealSchema.index({ dealStatus: 1 });
dealSchema.index({ buyerId: 1 });
dealSchema.index({ sellerId: 1 });

export default mongoose.models.Deal || mongoose.model("Deal", dealSchema);
