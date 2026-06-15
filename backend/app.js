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

const app = express();

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

app.get("/", (req, res) => {
  res.json({
    message: "Estate Ease API Running Backend Active",
  });
});

export default app;
