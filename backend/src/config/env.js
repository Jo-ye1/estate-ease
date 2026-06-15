import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly point to root backend folder
dotenv.config({ 
  path: path.resolve(__dirname, "../../.env") 
});

console.log("Database URI String State ->", process.env.MONGO_URI ? "LOADED SUCCESSFULLY ✅" : "UNDEFINED / MISSING ❌");
