import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth"; // make sure this path matches your project structure
import dotenv from "dotenv"; // Import dotenv

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000", credentials: true })); // Use CORS_ORIGIN from .env or fallback to default
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/", (_req, res) => {
  res.send("🚀 Backend server running...");
});

// Start server
const PORT = process.env.PORT || 4000; // Use PORT from .env or fallback to 4000
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
