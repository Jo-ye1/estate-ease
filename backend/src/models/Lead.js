import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
    },

    // 🟢 UPDATED: Full CRM pipeline lifecycle statuses
    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "qualified",
        "negotiating",
        "won",
        "lost",
        "archived"
      ],
      default: "new"
    },

    source: {
      type: String,
      default: "property_contact_form",
    },

    // 🟢 ADDED: CRM Progression tracking timestamps
    contactedAt: {
      type: Date,
      default: null,
    },

    qualifiedAt: {
      type: Date,
      default: null,
    },

    negotiatingAt: {
      type: Date,
      default: null,
    },

    closedAt: {
      type: Date,
      default: null,
    },

    // 🟢 ADDED: Lost details logging
    lossReason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

leadSchema.index({ owner: 1 });
leadSchema.index({ buyer: 1 });
leadSchema.index({ property: 1 });

export default mongoose.model("Lead", leadSchema);
