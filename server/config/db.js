import mongoose from "mongoose";

export async function connectDb() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing.");
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
