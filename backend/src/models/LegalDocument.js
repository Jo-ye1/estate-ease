import mongoose from "mongoose";

const legalDocumentSchema = new mongoose.Schema(
  {
    docType: {
      type: String,
      enum: ["LEASE_AGREEMENT", "PURCHASE_AGREEMENT", "COMMISSION_SLIP", "INVOICE"],
      required: true
    },
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
    signatories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    documentHash: {
      type: String,
      required: true,
      unique: true
    },
    compiledContent: {
      type: String,
      required: true // Securely stores the static historical text block snapshot
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("LegalDocument", legalDocumentSchema);
