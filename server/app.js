import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDb, hasMongoConfig } from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "https://nilgit-store.vercel.app"
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({ message: "Nilgit Store API is running." });
});

app.use("/api", async (req, res, next) => {
  if (!hasMongoConfig()) {
    if (req.method === "GET" && req.path.startsWith("/products")) {
      req.dbError = new Error("MongoDB is not configured.");
      next();
      return;
    }

    res.status(503).json({
      message: "Database is not connected. Please configure MONGO_URI."
    });
    return;
  }

  try {
    await connectDb();
    next();
  } catch (error) {
    if (req.method === "GET" && req.path.startsWith("/products")) {
      req.dbError = error;
      next();
      return;
    }

    res.status(503).json({
      message: "Database is not connected. Please configure MONGO_URI."
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/uploads", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
