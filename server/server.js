import dotenv from "dotenv";
import app from "./app.js";
import { connectDb } from "./config/db.js";

dotenv.config();

const port = process.env.PORT || 5000;

try {
  await connectDb();

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
} catch (error) {
  console.error("Server failed to start:", error.message);
  process.exit(1);
}
