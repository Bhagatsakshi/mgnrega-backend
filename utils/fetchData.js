import axios from "axios";
import fs from "fs";
import path from "path";

const cachePath = path.resolve("cache/dataCache.json");

// Fetch from data.gov.in API
export const fetchMGNREGAData = async () => {
    // ✅ Use the WORKING dataset ID and your valid API key
    const API_URL = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${process.env.API_KEY}&format=json&limit=50`;

    try {
        const { data } = await axios.get(API_URL);
        fs.writeFileSync(cachePath, JSON.stringify(data, null, 2));
        console.log("✅ Data fetched & cached successfully.");
        return data;
    } catch (error) {
        console.error("⚠️ API down or fetch failed, reading from cache...");
        const cached = fs.existsSync(cachePath)
            ? JSON.parse(fs.readFileSync(cachePath, "utf-8"))
            : { error: "No cached data available." };
        return cached;
    }
};
