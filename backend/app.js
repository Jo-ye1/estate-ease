import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";
import propertyRoutes from "./src/routes/propertyRoutes.js";
import favoriteRoutes from "./src/routes/favoriteRoutes.js";
import newsletterRoutes from "./src/routes/newsletterRoutes.js"; 
import testimonialRoutes from "./src/routes/testimonialRoutes.js";
import adminCmsRouter from "./src/routes/adminCmsRoutes.js"; 
import settingsRouter from "./src/routes/settingsRoute.js"; 
import adminRoutes from "./src/routes/adminRoutes.js"; 
import leadRoutes from "./src/routes/leadRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";
import analyticsRoutes from "./src/routes/analyticsRoutes.js";
import rateLimit from "express-rate-limit";
import messageRoutes from "./src/routes/messageRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import propertyAnalyticsRoutes from "./src/routes/propertyAnalyticsRoutes.js";
import auditRoutes from "./src/routes/auditRoutes.js";
import propertySLARoutes from  "./src/routes/propertySLARoutes.js";
import savedSearchRoutes from  "./src/routes/savedSearchRoutes.js";
import trendingRoutes from  "./src/routes/trendingRoutes.js";
import recentlyViewedRoutes from  "./src/routes/recentlyViewedRoutes.js";
import recommendationRoutes from  "./src/routes/recommendationRoutes.js";
import subscriptionRoutes from  "./src/routes/subscriptionRoutes.js";

import { upgradePlan } from "./src/controllers/subscriptionController.js";
import { protect } from "./src/middleware/authMiddleware.js";
import Subscription from "./src/models/Subscription.js";
import mongoose from "mongoose";

const app = express();
trendingRoutes
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: "Too many requests. Try again later.",
  skip: (req) => req.ip === "::1" || req.ip === "127.0.0.1" || req.ip === "::ffff:127.0.0.1"
});

app.use("/api", apiLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts.",
  skip: (req) => req.ip === "::1" || req.ip === "127.0.0.1" || req.ip === "::ffff:127.0.0.1"
});

app.use("/api/users/login", authLimiter);
app.use("/api/users/register", authLimiter);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/uploads", express.static("uploads"));
app.use("/uploads/advisors", express.static("uploads/advisors"));

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/admin-settings", adminCmsRouter); 
app.use("/api/settings", settingsRouter);
app.use("/api/admin", adminRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/notifications", notificationRoutes)
app.use("/api/analytics", analyticsRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/property-sla", propertySLARoutes);

app.use(
  "/api/property-analytics",
  propertyAnalyticsRoutes
);

app.use(
  "/api/audit",
  auditRoutes
);

app.get("/", (req, res) => {
  res.json({
    message: "Estate Ease API Running Backend Active",
  });
});

app.use(
  "/api/saved-searches",
  savedSearchRoutes
);

app.use("/api/trending", trendingRoutes);

app.use(
  "/api/recently-viewed",
  recentlyViewedRoutes
);

app.use(
  "/api/recommendations",
  recommendationRoutes
);

app.use(
  "/api/subscriptions",
  subscriptionRoutes
);

const seedAccountToPro = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve) => mongoose.connection.once("open", resolve));
    }

    const User = mongoose.model("User");
    const user = await User.findOne({ email: "1234567890@gmail.com" });


    if (!user) return;

    let sub = await Subscription.findOne({ user: user._id });
    if (!sub) {
      sub = new Subscription({ user: user._id });
    }

    sub.plan = "pro";
    sub.status = "active";
    sub.startDate = new Date();
    sub.endDate = null;

    await sub.save();
    console.log(`\n======================================================`);
    console.log(`⚡ [SUCCESS] FORCE-UPGRADED ACCOUNT TO PRO TIER IN DB!`);
    console.log(`👤 User ID: ${user._id}`);
    console.log(`✉️  Email:   ${user.email}`);
    console.log(`======================================================\n`);
  } catch (err) {
    console.error(`[Developer Seeder Error] Migration failed: ${err.message}`);
  }
};

seedAccountToPro();

export default app;
