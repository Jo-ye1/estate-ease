// Inside backend/src/server.js
import "./config/env.js"; // Loads environment keys first!
import app from "../app.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 5000;

// ⚡ 1. Keep the Node.js server process alive and listening
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// 📊 2. Live Database Diagnostic Scanner (Fires safely only after connection is active)
mongoose.connection.on("connected", async () => {
  try {
    console.log(`🏠 LOCAL DATABASE CONNECTED: ${mongoose.connection.host}`);
    
    const usersCollection = mongoose.connection.db.collection("users");
    const usersList = await usersCollection.find({}).toArray();
    
    console.log("\n==================================================");
    console.log("📊 LIVE MONGO DATABASE USER ACCESS RECOGNITION ROSTER:");
    console.log("==================================================");
    
    if (usersList.length === 0) {
      console.log("❌ ALERT: The user collection is completely empty!");
    } else {
      usersList.forEach((account) => {
        console.log(`👤 Name: ${account.name} | ✉️ Email: ${account.email} | 👑 Role: ${account.role || "user"}`);
      });
    }
    console.log("==================================================\n");
    
  } catch (err) {
    console.error("Diagnostic scanner encountered an error:", err.message);
  }
});
