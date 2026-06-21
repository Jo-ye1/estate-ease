import mongoose from "mongoose";
import Lead from "../models/Lead.js";
import LeadTask from "../models/LeadTask.js";
import Property from "../models/Property.js";
import User from "../models/User.js";

export const seedCommandHubData = async (req, res) => {
  try {
    const userId = req.user._id;
    const RevenueModel = mongoose.models.Revenue || mongoose.model("Revenue", new mongoose.Schema({}, { strict: false }));

    // 1. Purge legacy empty mockup states across target collection scopes
    await Lead.deleteMany({ owner: userId });
    await LeadTask.deleteMany({ assignedTo: userId });
    await RevenueModel.deleteMany({ agency: req.user.agencyId || userId });

    // 2. Auto-generate baseline Listing Property Document for financial aggregation reference
    const mockProperty = await Property.create({
      title: "Luxury Metro Executive Highrise Penthouse",
      description: "Automated test seeding document for analytical grid metrics calibration.",
      location: "Downtown Core Metropolitan",
      listingType: "sale",
      pricing: { salePrice: 1250000, monthlyRent: 0, dailyRate: 0 },
      owner: userId,
      status: "approved"
    });

    // 3. Inject mock leads distributed across your different Kanban lanes
    const laneDistributionArray = [
      { name: "John Smith", stage: "new", msg: "Inquiring about penthouse units." },
      { name: "Sarah Jenkins", stage: "contacted", msg: "Callback requested regarding layout views." },
      { name: "David Miller", stage: "viewing", msg: "Tour booked for corporate assessment profiles." },
      { name: "Alice Brooks", stage: "negotiation", msg: "Offer package structured under review." },
      { name: "Robert Chase", stage: "closed", msg: "Transaction finalized and settled." }
    ];

    for (const leadItem of laneDistributionArray) {
      await Lead.create({
        name: leadItem.name,
        email: `${leadItem.name.toLowerCase().replace(" ", "")}@estateease-seed.com`,
        phone: "+1 (555) 019-2834",
        message: leadItem.msg,
        pipelineStage: leadItem.stage,
        source: "property_contact_form",
        priority: leadItem.stage === "negotiation" ? "urgent" : "medium",
        owner: userId,
        property: mockProperty._id,
        status: leadItem.stage === "closed" ? "won" : "active"
      });
    }

    // 4. Populate active tasks to hydrate your pending indicators ribbon
    await LeadTask.create({
      lead: userId,
      assignedTo: userId,
      title: "Audit escrow disclosure parameters for Penthouse deal",
      description: "Automated checklist task tracking verification.",
      priority: "high",
      dueDate: new Date(Date.now() + 86400000),
      status: "pending"
    });

    // 5. Populate structured financial ledger rows to make your charts light up immediately
    const historicalRevenueTrendMonths = [
      { month: "Jan", rev: 23000, agentCut: 17250, agencyCut: 5750 },
      { month: "Feb", rev: 31000, agentCut: 23250, agencyCut: 7750 },
      { month: "Mar", rev: 28000, agentCut: 21000, agencyCut: 7000 },
      { month: "Apr", rev: 42000, agentCut: 31500, agencyCut: 10500 },
      { month: "May", rev: 38000, agentCut: 28500, agencyCut: 9500 },
      { month: "Jun", rev: 51000, agentCut: 38250, agencyCut: 12750 }
    ];

    for (const trend of historicalRevenueTrendMonths) {
      await RevenueModel.create({
        agency: req.user.agencyId || userId,
        agent: userId,
        property: mockProperty._id,
        totalDealValue: trend.rev * 20,
        grossCommission: trend.rev,
        agentCut: trend.agentCut,
        agencyCut: trend.agencyCut,
        status: "cleared",
        processedAt: new Date(`2026-${historicalRevenueTrendMonths.indexOf(trend) + 1}-15`)
      });
    }

    res.json({ success: true, message: "Database cluster telemetry records populated cleanly. Refreshing charts..." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
