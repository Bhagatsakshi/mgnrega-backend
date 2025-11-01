import express from "express";
const router = express.Router();

// Proxy route for location detection
router.get("/", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude and Longitude are required" });
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
      {
        headers: {
          "User-Agent": "OurVoiceOurRights/1.0 (contact@example.com)", // 👈 Required by Nominatim
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Nominatim error: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching location:", error);
    res.status(500).json({ error: "Failed to detect location" });
  }
});

export default router;
