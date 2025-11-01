import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import mgnregaRoutes from "./routes/mgnregaRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup
const allowedOrigins = [
  "http://localhost:5173",
  "https://your-frontend-name.onrender.com",
];
app.use(cors({ origin: allowedOrigins, methods: ["GET", "POST"] }));

// Connect DB
connectDB();

// Routes
app.use("/api/mgnrega", mgnregaRoutes);
app.use("/api/upload", uploadRoutes);

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
