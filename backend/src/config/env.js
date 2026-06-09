import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly loads your keys from the backend root folder before anything else runs
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
