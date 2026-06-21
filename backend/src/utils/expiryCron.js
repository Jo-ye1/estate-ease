import cron from "node-cron";
import mongoose from "mongoose";
import { createNotification } from "./createNotification.js";

export const initializeLifecycleExpiryWorker = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const PropertyModel = mongoose.model("Property");
      const today = new Date();

      const deadProperties = await PropertyModel.find({
        isExpired: false,
        expiresAt: { $lte: today, $ne: null }
      });

      for (const prop of deadProperties) {
        prop.isExpired = true;
        prop.listingStatus = "expired";
        prop.renewalStatus = "expired";
        await prop.save();

        await createNotification({
          recipient: prop.owner,
          type: "PROPERTY_EXPIRED",
          title: "Listing Has Expired",
          message: `Your property listing "${prop.title}" has reached its active 30-day timeline cap and is now hidden from the marketplace.`,
          relatedId: prop._id,
          relatedType: "Property"
        });
      }
    } catch (err) {
      console.error("🔥 [LIFECYCLE ENGINE CRON ERROR]:", err.message);
    }
  });
};
