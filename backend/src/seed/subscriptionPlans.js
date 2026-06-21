import SubscriptionPlan from "../models/SubscriptionPlan.js";

export const seedPlans = async () => {
  try {
    const exists = await SubscriptionPlan.countDocuments();

    if (exists > 0) {
      console.log("[Seeder] Subscription plans already exist in database. Skipping...");
      return;
    }

    await SubscriptionPlan.insertMany([
      {
        name: "Free",
        price: 0,
        listingLimit: 3,
        boostLimit: 0,
        analyticsAccess: false,
        prioritySupport: false
      },
      {
        name: "Pro",
        price: 49,
        listingLimit: 25,
        boostLimit: 5,
        analyticsAccess: true,
        prioritySupport: false
      },
      {
        name: "Enterprise",
        price: 199,
        listingLimit: 999,
        boostLimit: 999,
        analyticsAccess: true,
        prioritySupport: true,
      },
    ]);

    console.log("\n======================================================");
    console.log("🌱 [SUCCESS] SUBSCRIPTION PLANS SEEDED INTO MONGODB!");
    console.log("======================================================\n");
  } catch (error) {
    console.error(`[Seeder Error] Failed to seed subscription plans: ${error.message}`);
  }
};
