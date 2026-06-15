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

    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },

    source: {
      type: String,
      default: "property_contact_form",
    },
  },
  { timestamps: true }
);

leadSchema.index({ owner: 1 });
leadSchema.index({ buyer: 1 });
leadSchema.index({ property: 1 });

export default mongoose.model("Lead", leadSchema);
