import cron from "node-cron";
import mongoose from "mongoose";
import { sendMarketplaceEmail } from "./emailService.js";

export const initializeLeadInactivityEngine = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const LeadModel = mongoose.model("Lead");
      
      const threeDaysAgoStart = new Date();
      threeDaysAgoStart.setDate(threeDaysAgoStart.getDate() - 3);
      threeDaysAgoStart.setHours(0,0,0,0);

      const threeDaysAgoEnd = new Date();
      threeDaysAgoEnd.setDate(threeDaysAgoEnd.getDate() - 3);
      threeDaysAgoEnd.setHours(23,59,59,999);

      // Finds inquiries left unattended for exactly 3 trailing days
      const staleLeads = await LeadModel.find({
        status: { $in: ["pending", "contacted"] },
        updatedAt: { $gte: threeDaysAgoStart, $lte: threeDaysAgoEnd }
      }).populate("user", "email name").populate("propertyId", "title");

      for (const lead of staleLeads) {
        if (lead.user?.email) {
          await sendMarketplaceEmail({
            to: lead.user.email,
            subject: "Still interested in this property?",
            text: `Hello ${lead.user.name || "Valued Buyer"},\n\nYou previously showed interest in the property listing: "${lead.propertyId?.title || "Marketplace Listing"}". Are you still looking to connect with the seller? Reply to this notice or check your portal inbox for recent thread responses.`
          });
        }
      }
    } catch (err) {
      console.error("🔥 [LEAD INACTIVITY AUTOMATION EXCEPTION]:", err.message);
    }
  });
};
