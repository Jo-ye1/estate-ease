import mongoose from "mongoose";

export const executeInAppDatabaseSeed = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const LeadModel = mongoose.model("Lead");
    const LeadTaskModel = mongoose.model("LeadTask");
    const PropertyModel = mongoose.model("Property");
    const CalendarEventModel = mongoose.model("CalendarEvent");
    const RevenueModel = mongoose.models.Revenue || mongoose.model("Revenue");

    await LeadModel.deleteMany({ owner: currentUserId });
    await LeadTaskModel.deleteMany({ assignedTo: currentUserId });
    await CalendarEventModel.deleteMany({ createdBy: currentUserId });

    const seedProperty = await PropertyModel.create({
      title: "Grand Horizon Metropolitan Penthouse",
      description: "SaaS system data validation asset node.",
      location: "Downtown Premium Sector",
      listingType: "sale",
      pricing: { salePrice: 1450000, monthlyRent: 0, dailyRate: 0 },
      owner: currentUserId,
      status: "approved"
    });

    const mockLeadsData = [
      { name: "Sarah Jenkins", stage: "new", msg: "Inquiring about listing pricing guides." },
      { name: "Michael Chang", stage: "contacted", msg: "Scheduling virtual tour callback window." },
      { name: "Amanda Ross", stage: "viewing", msg: "Physical walkthrough tour requested." },
      { name: "David Vance", stage: "negotiation", msg: "Escrow purchase contract outline drafted." },
      { name: "Jessica Miller", stage: "closed", msg: "Closing signatures processed successfully." }
    ];

    for (const lead of mockLeadsData) {
      await LeadModel.create({
        name: lead.name,
        email: `${lead.name.toLowerCase().replace(" ", "")}@estateease-live.com`,
        phone: "+1 (555) 014-9832",
        message: lead.msg,
        pipelineStage: lead.stage,
        source: "property_contact_form",
        priority: lead.stage === "negotiation" ? "urgent" : "medium",
        owner: currentUserId,
        property: seedProperty._id,
        status: lead.stage === "closed" ? "won" : "active"
      });
    }

    await LeadTaskModel.create({
      lead: currentUserId,
      assignedTo: currentUserId,
      title: "Review closing compliance folders for Sarah Jenkins file",
      description: "Automated test validation milestone verification task.",
      priority: "high",
      dueDate: new Date(Date.now() + 86400000),
      status: "pending"
    });

    await CalendarEventModel.create([
      { title: "On-Site Visit: Grand Horizon", eventType: "property_visit", status: "scheduled", startDate: new Date(), endDate: new Date(), createdBy: currentUserId, assignedTo: currentUserId },
      { title: "Review Initial Escrow Disclosures", eventType: "meeting", status: "completed", startDate: new Date(), endDate: new Date(), createdBy: currentUserId, assignedTo: currentUserId }
    ]);

    res.json({ 
      success: true, 
      message: "Database telemetry successfully bound to active profile session. All charts and matrix tables hydrated!" 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
