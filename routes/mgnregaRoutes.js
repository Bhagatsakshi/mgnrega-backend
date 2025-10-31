import express from "express";
import { syncMGNREGAData, getCachedMGNREGA } from "../controllers/mgnregaController.js";

const router = express.Router();

// Sync (fetch from data.gov.in and cache)
router.get("/sync", syncMGNREGAData);

// Get cached data - use query params ?state=...&district=...
router.get("/", getCachedMGNREGA);

export default router;
