import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Reads directly from your local .env configuration line
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`\n🏠 LOCAL DATABASE CONNECTED: ${conn.connection.host}\n`);
  } catch (error) {
    console.error(`🚨 Local DB Failure: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
