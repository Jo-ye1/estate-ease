import mongoose from "mongoose";
import crypto from "crypto";

export const compileLegalDocumentSnapshot = async (req, res) => {
  try {
    const { leadId, docType } = req.body;
    const LeadModel = mongoose.model("Lead");
    const PropertyModel = mongoose.model("Property");
    const UserModel = mongoose.model("User");
    const LegalDocumentModel = mongoose.model("LegalDocument");

    const lead = await LeadModel.findById(leadId).populate("user", "name email");
    if (!lead) {
      return res.status(404).json({ message: "Transaction lead document not found." });
    }

    const property = await PropertyModel.findById(lead.propertyId).populate("owner", "name email");
    if (!property) {
      return res.status(404).json({ message: "Target property listing not found." });
    }

    const price = property.pricing?.salePrice || property.pricing?.monthlyRent || property.pricing?.dailyRate || 0;
    const buyerName = lead.user?.name || "Verified Buyer";
    const sellerName = property.owner?.name || "Verified Provider";

    let templateLayoutHTML = "";

    if (docType === "LEASE_AGREEMENT") {
      templateLayoutHTML = `
        <div style="font-family:sans-serif;padding:40px;color:#1e293b;max-width:800px;margin:auto;line-height:1.6;">
          <h1 style="text-transform:uppercase;font-size:24px;font-weight:900;letter-spacing:-0.5px;border-b:2px solid #e2e8f0;padding-bottom:10px;">Binding Lease Agreement</h1>
          <p style="margin-top:20px;">This residential/commercial lease contract certifies the tenancy terms binding the undersigned parties:</p>
          <div style="background:#f8fafc;padding:20px;border-radius:12px;margin:20px 0;font-size:13px;font-weight:600;">
            <p>LANDLORD PROVIDER: ${sellerName} (${property.owner?.email || "N/A"})</p>
            <p>TENANT ACQUISITION: ${buyerName} (${lead.user?.email || "N/A"})</p>
            <p>PROPERTY PREMISES: ${property.title} - ${property.location}</p>
            <p>LEASE RATE STRUCTURE: $${price} USD / Month</p>
          </div>
          <p style="font-size:12px;color:#64748b;margin-top:40px;">By executing this digital document, both parties bind their signatures to the platform's standard terms of service lease regulations safely.</p>
        </div>
      `;
    } else {
      templateLayoutHTML = `
        <div style="font-family:sans-serif;padding:40px;color:#1e293b;max-width:800px;margin:auto;line-height:1.6;">
          <h1 style="text-transform:uppercase;font-size:24px;font-weight:900;letter-spacing:-0.5px;border-b:2px solid #e2e8f0;padding-bottom:10px;">Official Purchase Contract & Invoice</h1>
          <div style="background:#f8fafc;padding:20px;border-radius:12px;margin:20px 0;font-size:13px;font-weight:600;">
            <p>PREPARED FOR: ${buyerName}</p>
            <p>ISSUED BY: ${sellerName}</p>
            <p>ASSET SPECIFICATION: ${property.title}</p>
            <p>FINAL SETTLED CONSIDERATION: $${price} USD</p>
          </div>
        </div>
      `;
    }

    const uniqueHash = crypto
      .createHash("sha256")
      .update(`${leadId}-${docType}-${price}-${Date.now()}`)
      .digest("hex");

    const documentRecord = await LegalDocumentModel.create({
      docType,
      propertyId: property._id,
      leadId: lead._id,
      signatories: [property.owner._id, lead.user._id],
      documentHash: uniqueHash,
      compiledContent: templateLayoutHTML
    });

    res.status(201).json({
      success: true,
      message: "Legal compliance document generated successfully.",
      documentId: documentRecord._id,
      verificationHash: uniqueHash,
      htmlPayload: templateLayoutHTML
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
