import express from "express";
import serverless from "serverless-http";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { connectDB } from "../lib/db.js";
import authRoutes from "../routes/auth.route.js";
import messageRoutes from "../routes/message.route.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Your routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Serve frontend (optional if deploying separately)
app.use(express.static(path.join(__dirname, "../FRONTEND/dist")));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../FRONTEND/dist", "index.html"));
});

// Connect DB once at cold start
connectDB();

// ✅ Export the app as a serverless handler for Vercel
export const handler = serverless(app);
export default app;
