const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const router = express.Router();

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /upload route
router.post("/", upload.single("image"), (req, res) => {
  // Check if file is present
  if (!req.file) {
    return res.status(400).json({ message: "no file uploaded" });
  }

  // Convert buffer to data url
  const fileStr = req.file.buffer.toString("base64");
  const fileDataUrl = `data:${req.file.mimetype};base64,${fileStr}`;

  // Upload file to cloudinary
  cloudinary.uploader.upload(fileDataUrl, (error, result) => {
    if (error) {
      return res.status(500).json({ error: "failed to upload file" });
    }

    // Return the cloudinary URL of the uploaded image
    res.json({ url: result.secure_url });
  });
});

module.exports = router;
