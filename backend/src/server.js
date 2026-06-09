// Inside backend/src/server.js
import "./config/env.js"; // <-- CRUCIAL: MUST BE LINE 1 to load environment keys first!
import app from "../app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
