const multer = require("multer");
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // Limit file size to 20MB
  },
});

const uploadSingle = upload.single("image");

const uploadMultiple = upload.array("galleryImages");

const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "galleryImages", maxCount: 12 },
]);

module.exports = { uploadSingle, uploadMultiple, uploadFields };
