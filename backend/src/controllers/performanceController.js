import mongoose from "mongoose";

export const getSellerPerformanceSummary = async (req, res) => {
  try {
    const PropertyModel = mongoose.model("Property");
    const LeadModel = mongoose.model("Lead");
    const userId = req.user._id;

    const myProperties = await PropertyModel.find({ owner: userId });
    const propertyIds = myProperties.map(p => p._id);

    const myLeads = await LeadModel.find({ propertyId: { $in: propertyIds } });

    const totalLeadsCount = myLeads.length;
    const wonLeadsCount = myLeads.filter(l => l.status === "won").length;
    const conversionRate = totalLeadsCount === 0 ? 0 : Math.round((wonLeadsCount / totalLeadsCount) * 100);

    let performanceProfiles = myProperties.map(prop => {
      const propLeads = myLeads.filter(l => l.propertyId.toString() === prop._id.toString());
      const propWon = propLeads.filter(l => l.status === "won").length;
      const propConvRate = propLeads.length === 0 ? 0 : (propWon / propLeads.length) * 100;

      return {
        id: prop._id,
        title: prop.title,
        location: prop.location,
        leadsCount: propLeads.length,
        conversionRate: propConvRate,
        status: prop.listingStatus
      };
    });

    performanceProfiles.sort((a, b) => b.conversionRate - a.conversionRate || b.leadsCount - a.leadsCount);

    const topListing = performanceProfiles[0] || null;
    const weakListing = performanceProfiles.length > 1 ? performanceProfiles[performanceProfiles.length - 1] : null;

    let systemRenewalSuggestions = [];
    myProperties.forEach(prop => {
      if (prop.listingStatus === "expired" || prop.listingStatus === "archived") {
        systemRenewalSuggestions.push(`Your listing "${prop.title}" is currently offline. Reactivate it to capture traffic.`);
      }
    });

    if (topListing && topListing.conversionRate > 30) {
      systemRenewalSuggestions.push(`Your ${topListing.location || "portfolio"} asset converts ${Math.round(topListing.conversionRate)}% higher than alternative categories. Consider boosting its exposure score.`);
    }

    res.json({
      success: true,
      summary: {
        totalListingsCount: myProperties.length,
        leadConversionRate: `${conversionRate}%`,
        responseSpeed: "Under 3 hours",
        topListing: topListing ? { title: topListing.title, conversion: `${Math.round(topListing.conversionRate)}%` } : null,
        weakListing: weakListing ? { title: weakListing.title, conversion: `${Math.round(weakListing.conversionRate)}%` } : null,
        renewalSuggestions: systemRenewalSuggestions.length > 0 ? systemRenewalSuggestions : ["Your active listing values are optimally aligned."]
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
