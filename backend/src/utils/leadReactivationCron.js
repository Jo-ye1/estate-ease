import cron from "node-cron";
import mongoose from "mongoose";
import { createNotification } from "./createNotification.js";
import { sendMarketplaceEmail } from "./emailService.js";

export const initializeLeadReactivationEngine = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const LeadModel = mongoose.model("Lead");
      const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);

      const coldLeads = await LeadModel.find({
        status: "contacted",
        lastInteractionAt: { $lte: fiveDaysAgo }
      }).populate("user", "email name").populate("propertyId", "title owner");

      for (const lead of coldLeads) {
        if (lead.propertyId?.owner) {
          await createNotification({
            recipient: lead.propertyId.owner,
            type: "LEAD_STATUS_UPDATED",
            title: "Follow-Up Reminder",
            message: `Your inbound inquiry from ${lead.user?.name || "a buyer"} regarding "${lead.propertyId.title}" has gone cold. Check your pipeline.`,
            relatedId: lead._id,
            relatedType: "Lead"
          });
        }

        if (lead.user?.email) {
          await sendMarketplaceEmail({
            to: lead.user.email,
            subject: "Are you still searching?",
            text: `Hello ${lead.user.name || "Valued Buyer"},\n\nWe noticed you were recently inquiring about "${lead.propertyId?.title || "one of our properties"}". Are you still looking for a space? Check back in with the owner or explore new matching listings live on our marketplace!`
          });
        }

        lead.lastInteractionAt = new Date();
        await lead.save();
      }
    } catch (err) {
      console.error("🔥 [LEAD COLD REACTIVATION INTERCEPTOR ERROR]:", err.message);
    }
  });
};
