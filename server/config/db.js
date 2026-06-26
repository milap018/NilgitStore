import mongoose from "mongoose";

export function hasMongoConfig() {
  const uri = process.env.MONGO_URI || "";

  if (!uri) {
    return false;
  }

// These markers usually mean the env file is still a template and not a real database URI.
  const placeholderMarkers = ["username:password", "your_", "change_this_to"];
  return !placeholderMarkers.some((marker) => uri.includes(marker));
}

export async function connectDb() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!hasMongoConfig()) {
// Let the app start even without Mongo so the learning demo still works locally.
    throw new Error("MONGO_URI is missing or still using placeholder values.");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
}
