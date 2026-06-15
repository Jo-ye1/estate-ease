import dns from "dns";
import mongoose from "mongoose";

// Force Node.js to prioritize IPv4 over IPv6 to resolve localhost connection lags
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

const connectDB = async () => {
  try {
    // Dynamically look for the .env variable, fall back to localhost if undefined
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/estate_ease";

    if (uri.includes("mongodb.net")) {
      console.log("Connecting to Cloud Database (MongoDB Atlas)...");
    } else {
      console.log("Connecting locally to Offline MongoDB Service...");
    }

    const conn = await mongoose.connect(uri);
    
    console.log(`🚀 DATABASE CONNECTED SUCCESSFULLY: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MONGODB CONNECTION ERROR: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
