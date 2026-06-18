import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import http from "http";
import app from "../app.js";
import { initSocket } from "./socket/socket.js";

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
    const mongoUri =
      process.env.MONGO_URI ||
      "mongodb://127.0.0.1:27017/estate_ease";

    console.log("Connecting to MongoDB...");

    await mongoose.connect(mongoUri);

    const server = http.createServer(app);

    initSocket(server);

    server.listen(PORT, () => {
      console.log(`Estate Ease API + Socket running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
