import mongoose from "mongoose";

async function executeDirectSeed() {
  try {
    console.log("Connecting directly to database node...");
    await mongoose.connect("mongodb://127.0.0.1:27017/estate-ease");
    
    const CalendarEventModel = mongoose.models.CalendarEvent || mongoose.model("CalendarEvent", new mongoose.Schema({}, { strict: false }));
    const LeadModel = mongoose.models.Lead || mongoose.model("Lead", new mongoose.Schema({}, { strict: false }));

    await CalendarEventModel.deleteMany({});
    await LeadModel.deleteMany({});

    const mockAgencyId = new mongoose.Types.ObjectId();
    const mockAgentId = new mongoose.Types.ObjectId();

    await CalendarEventModel.create([
      { title: "Client Viewing: Luxury Penthouse", eventType: "property_visit", status: "scheduled", startDate: new Date(), endDate: new Date(), agencyId: mockAgencyId, createdBy: mockAgentId, assignedTo: mockAgentId },
      { title: "Contract Agreement Review", eventType: "meeting", status: "completed", startDate: new Date(), endDate: new Date(), agencyId: mockAgencyId, createdBy: mockAgentId, assignedTo: mockAgentId },
      { title: "Follow-up Call: Investor Pool", eventType: "call", status: "scheduled", startDate: new Date(), endDate: new Date(), agencyId: mockAgencyId, createdBy: mockAgentId, assignedTo: mockAgentId }
    ]);

    console.log("🚀 Database telemetry data injected successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding crash:", err.message);
    process.exit(1);
  }
}

executeDirectSeed();
