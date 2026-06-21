import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import http from "http";
import app from "../app.js";
import { initSocket } from "./socket/socket.js";
import { initializeLifecycleExpiryWorker } from "./utils/expiryCron.js";
import { initializeLifecycleReminderWorker } from "./utils/reminderCron.js";
import { initializeAutomatedLeadFollowUpWorker } from "./utils/leadFollowUpCron.js";
import { initializeLeadInactivityEngine } from "./utils/leadInactivityCron.js";
import { initializeLeadReactivationEngine } from "./utils/leadReactivationCron.js";
import { initializeBillingCycleAutomation } from "./utils/billingCron.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const PORT = process.env.PORT || 5000;

mongoose.connection.on("connected", () => {
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected.");
});

const startServer = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/estate_ease";

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);

    initializeLifecycleExpiryWorker();
    initializeLifecycleReminderWorker(); 
    initializeAutomatedLeadFollowUpWorker();
    initializeLeadInactivityEngine();
    initializeLeadReactivationEngine();
    initializeBillingCycleAutomation();

    const server = http.createServer(app);
    
    // 🟢 FIXED: Captured the initialized Socket.io server instance and attached it to the express app context
    const io = initSocket(server);
    app.set("io", io);

    server.listen(PORT, () => {
      console.log(`Estate Ease API + Socket running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
