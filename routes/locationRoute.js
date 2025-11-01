import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// GET /api/location?lat=...&lon=...
router.get("/", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude and longitude required" });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "mgnrega-app/1.0 (your-email@example.com)", // Required by Nominatim
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error fetching location:", err);
    res.status(500).json({ error: "Failed to fetch location data" });
  }
});

export default router;
