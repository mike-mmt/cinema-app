const multer = require("multer");
const storage = multer.memoryStorage();
const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // Limit file size to 20MB
  },
});

module.exports = uploadMiddleware;
