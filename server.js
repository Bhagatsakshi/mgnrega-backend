import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mgnregaRoutes from "./routes/mgnregaRoute.js";
import uploadRoutes from "./routes/uploadRoute.js";
import locationRoutes from "./routes/locationRoute.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: [
            "http://localhost:5173", // local frontend
            "https://gorgeous-cendol-820b40.netlify.app", // deployed frontend
        ],
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true,
    })
);

app.use("/uploads", express.static("uploads"));

app.use("/api/mgnrega", mgnregaRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/location", locationRoutes);

app.get("/", (req, res) => {
    res.send("✅ MGNREGA backend running fine!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
