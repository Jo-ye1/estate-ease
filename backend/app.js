import express from "express";
import cors from "cors";

import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import propertyRoutes from "./src/routes/propertyRoutes.js";
import favoriteRoutes from "./src/routes/favoriteRoutes.js";
import newsletterRoutes from "./src/routes/newsletterRoutes.js"; 

// Initialize database connection
connectDB();

const app = express();

// Middleware configuration
app.use(cors());
app.use(express.json());

// 🗂️ Exposes your uploaded local files publicly under http://localhost:5000/uploads/...
app.use("/uploads", express.static("uploads"));

// API Route mounts
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/newsletter", newsletterRoutes);

// Base route verify checkpoint
app.get("/", (req, res) => {
  res.json({
    message: "Estate Ease API Running",
  });
});

export default app;
