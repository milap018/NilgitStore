import dotenv from "dotenv";
import app from "./app.js";
import { connectDb, hasMongoConfig } from "./config/db.js";

dotenv.config();

const port = process.env.PORT || 5000;

try {
  if (hasMongoConfig()) {
    await connectDb();
    console.log("MongoDB connected for startup.");
  } else {
    console.warn("Starting server without MongoDB because MONGO_URI still uses placeholder values.");
  }
} catch (error) {
  console.warn("Starting server without MongoDB:", error.message);
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
