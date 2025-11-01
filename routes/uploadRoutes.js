import express from "express";
import multer from "multer";

const router = express.Router();

// Configure multer (store in memory or in 'uploads' folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// POST /api/upload
router.post("/", upload.single("audio"), (req, res) => {
  const { district } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  console.log("Received file:", file.originalname);
  console.log("District:", district);

  res.json({
    message: "File uploaded successfully!",
    fileName: file.originalname,
    district,
  });
});

export default router;
