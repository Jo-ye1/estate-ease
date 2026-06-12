// Inside backend/src/server.js
import "./config/env.js"; // Loads environment keys first!
import app from "../app.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 5000;

// ⚡ 1. Keep the Node.js server process alive and listening
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// 📊 2. Essential Database Connection Logger
mongoose.connection.on("connected", () => {
  console.log(`🏠 DATABASE CONNECTED: ${mongoose.connection.host}`);
});
