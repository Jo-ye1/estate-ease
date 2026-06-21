import cron from "node-cron";
import mongoose from "mongoose";
import { createNotification } from "./createNotification.js";

export const initializeAutomatedLeadFollowUpWorker = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const LeadModel = mongoose.model("Lead");
      const PropertyModel = mongoose.model("Property");
      
      const fiveDaysAgo = new Date();
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

      const staleLeads = await LeadModel.find({
        status: { $in: ["pending", "contacted"] },
        updatedAt: { $lte: fiveDaysAgo }
      });

      for (const lead of staleLeads) {
        const property = await PropertyModel.findById(lead.propertyId || lead.property);
        if (!property) continue;

        await createNotification({
          recipient: property.owner,
          type: "LEAD_STATUS_UPDATED",
          title: "Stale Lead Action Required",
          message: `Inquiry alert: A potential buyer's lead for your listing "${property.title}" has been sitting without activity for over 5 days. Follow up now!`,
          relatedId: lead._id,
          relatedType: "Lead"
        });
      }
    } catch (err) {
      console.error("🔥 [LEAD FOLLOW-UP SYSTEM TRACK ERROR]:", err.message);
    }
  });
};
