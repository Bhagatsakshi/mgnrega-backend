import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mgnregaRoutes from "./routes/mgnregaRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js"; // ✅ your upload route file
import locationRoutes from "./routes/locationRoute.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local frontend
      "https://mgnrega-frontend.onrender.com", // deployed frontend
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// ✅ serve static uploads folder (if needed)
app.use("/uploads", express.static("uploads"));

// ✅ route setup
app.use("/api/mgnrega", mgnregaRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/location", locationRoutes);

// ✅ base route for testing
app.get("/", (req, res) => {
  res.send("✅ MGNREGA backend running fine!");
});

// ✅ start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
