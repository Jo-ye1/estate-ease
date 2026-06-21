import cron from "node-cron";
import mongoose from "mongoose";
import { createNotification } from "./createNotification.js";
import { sendMarketplaceEmail } from "./emailService.js";

export const initializeLifecycleReminderWorker = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const PropertyModel = mongoose.model("Property");
      const today = new Date();

      const activeListings = await PropertyModel.find({
        listingStatus: "published",
        isExpired: false,
        expiresAt: { $gt: today, $ne: null }
      });

      for (const prop of activeListings) {
        const timeDiff = new Date(prop.expiresAt).getTime() - today.getTime();
        const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        let triggerToken = "";
        let alertTitle = "";
        let alertMessage = "";

        if (daysRemaining <= 7 && daysRemaining > 3) {
          triggerToken = "7_DAYS";
          alertTitle = "Listing Expiry Notice";
          alertMessage = `Your property listing "${prop.title}" will expire in 7 days. Plan ahead to ensure continuity.`;
        } else if (daysRemaining <= 3 && daysRemaining > 1) {
          triggerToken = "3_DAYS";
          alertTitle = "Urgent Renewal Reminder";
          alertMessage = `Urgent: Renew your listing "${prop.title}" now to keep marketplace search visibility.`;
          prop.renewalStatus = "due";
        } else if (daysRemaining <= 1 && daysRemaining >= 0) {
          triggerToken = "1_DAY";
          alertTitle = "Final Expiration Warning";
          alertMessage = `Final Notice: Your property listing "${prop.title}" will go offline in less than 24 hours.`;
          prop.renewalStatus = "due";
        }

        if (triggerToken && !prop.reminderLogs.includes(triggerToken)) {
          prop.reminderLogs.push(triggerToken);
          await prop.save();

          const populatedProp = await PropertyModel.findById(prop._id).populate("owner", "email name");
          
          if (populatedProp?.owner?.email) {
            await sendMarketplaceEmail({
              to: populatedProp.owner.email,
              subject: `Renew Your Listing Now - ${alertTitle}`,
              text: `Hello ${populatedProp.owner.name || "Seller"},\n\nThis is an automated alert reminder notice. ${alertMessage}\n\nLog into your dashboard workspace to extend your portfolio allocation limits.`
            });
          }

          await createNotification({
            recipient: prop.owner,
            type: "RENEWAL_REMINDER",
            title: alertTitle,
            message: alertMessage,
            relatedId: prop._id,
            relatedType: "Property"
          });
        }
      }
    } catch (err) {
      console.error("🔥 [REMINDER SYSTEM INTELLIGENCE CRASH]:", err.message);
    }
  });
};
