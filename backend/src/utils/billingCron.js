import cron from "node-cron";
import mongoose from "mongoose";
import { createNotification } from "./createNotification.js";
import { sendMarketplaceEmail } from "./emailService.js";

export const initializeBillingCycleAutomation = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const UserSubscriptionModel = mongoose.model("UserSubscription");
      const PropertyModel = mongoose.model("Property");
      const today = new Date();

      const overdueBillingCycles = await UserSubscriptionModel.find({
        status: "active",
        nextBillingDate: { $lte: today }
      }).populate("user", "email name");

      for (const sub of overdueBillingCycles) {
        // Simulates automated card charging hook. Modify with stripe bindings later.
        const paymentCapturedSuccessfully = false; 

        if (paymentCapturedSuccessfully) {
          sub.nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          sub.subscriptionExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          sub.billingStatus = "paid";
          await sub.save();
        } else {
          sub.status = "expired";
          sub.billingStatus = "failed";
          await sub.save();

          // 🟢 SYSTEM RE-ALIGNMENT DOWNGRADE LOGIC: Lock portfolio excess features
          const activeSellerProperties = await PropertyModel.find({ owner: sub.user._id, listingStatus: "published" });
          
          if (activeSellerProperties.length > 3) {
            // Free plan threshold cap is enforced, moving surplus assets to archive
            const surplusProperties = activeSellerProperties.slice(3);
            for (const prop of surplusProperties) {
              prop.listingStatus = "archived";
              await prop.save();
            }
          }

          if (sub.user?.email) {
            await sendMarketplaceEmail({
              to: sub.user.email,
              subject: "Subscription Payment Failed - Account Downgraded",
              text: `Hello ${sub.user.name || "Seller"},\n\nOur system was unable to process your recurring workspace plan renewal invoice. Your account tier has reverted to 'Free', and surplus listings have been safely hidden inside your archive matrix.`
            });
          }

          await createNotification({
            recipient: sub.user._id,
            type: "PAYMENT_FAILURE_ALERT",
            title: "Billing Allocation Failed",
            message: "Your premium capabilities have expired due to a payment failure. Surplus properties were auto-archived.",
            relatedId: sub._id,
            relatedType: "UserSubscription"
          });
        }
      }
    } catch (err) {
      console.error("🔥 [BILLING CYCLE RUNTIME MONITOR CRASH]:", err.message);
    }
  });
};
