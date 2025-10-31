import axios from "axios";
import Mgnrega from "../models/mgnregaModel.js";

/**
 * Sync (fetch) Kerala mandi data from data.gov.in and upsert into MongoDB.
 * Endpoint: GET /api/mgnrega/sync
 */
export const syncMGNREGAData = async (req, res, next) => {
  try {
    if (!process.env.API_KEY) {
      return res.status(500).json({ error: "API_KEY not configured in .env" });
    }

    // ✅ Only Kerala data
    const API_URL = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${process.env.API_KEY}&format=json&filters[state]=Kerala&limit=500`;

    console.log("📡 Fetching Kerala data from:", API_URL);

    const apiResp = await axios.get(API_URL, { timeout: 20000 });
    const records = apiResp.data?.records || [];

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(502).json({ error: "No Kerala records returned from API" });
    }

    // Prepare upsert operations
    const ops = records.map((r) => {
      const filter = {
        state: r.state?.trim(),
        district: r.district?.trim(),
        market: r.market?.trim(),
        commodity: r.commodity?.trim(),
        arrival_date: r.arrival_date?.trim(),
      };

      const update = {
        $set: {
          state: r.state,
          district: r.district,
          market: r.market,
          commodity: r.commodity,
          variety: r.variety,
          grade: r.grade,
          arrival_date: r.arrival_date,
          min_price: Number(r.min_price) || 0,
          max_price: Number(r.max_price) || 0,
          modal_price: Number(r.modal_price) || 0,
          lastUpdated: new Date(),
        },
      };

      return { updateOne: { filter, update, upsert: true } };
    });

    // Write in manageable chunks
    const CHUNK_SIZE = 100;
    for (let i = 0; i < ops.length; i += CHUNK_SIZE) {
      const chunk = ops.slice(i, i + CHUNK_SIZE);
      await Mgnrega.bulkWrite(chunk);
    }

    return res.json({
      success: true,
      imported: records.length,
      message: "✅ Kerala data synced successfully with MongoDB",
    });
  } catch (err) {
    console.error("❌ syncMGNREGAData error:", err.message || err);
    return next(err);
  }
};

/**
 * Get cached Kerala mandi data
 * Endpoint: GET /api/mgnrega
 * Optional: /api/mgnrega?district=Kozhikode&commodity=Rice
 */
export const getCachedMGNREGA = async (req, res, next) => {
  try {
    const { district, commodity, limit = 100 } = req.query;

    // ✅ Hardcoded filter for Kerala
    const filter = { state: "Kerala" };

    if (district) filter.district = { $regex: new RegExp(`${district}`, "i") };
    if (commodity) filter.commodity = { $regex: new RegExp(`${commodity}`, "i") };

    const docs = await Mgnrega.find(filter)
      .sort({ lastUpdated: -1 })
      .limit(Number(limit))
      .lean();

    if (!docs || docs.length === 0) {
      return res
        .status(404)
        .json({ message: "No cached data for Kerala. Run /sync to fetch." });
    }

    return res.json({
      count: docs.length,
      state: "Kerala",
      data: docs,
    });
  } catch (err) {
    console.error("❌ getCachedMGNREGA error:", err.message || err);
    return next(err);
  }
};
