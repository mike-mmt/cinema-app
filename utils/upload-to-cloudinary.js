const cloudinary = require("cloudinary").v2;
require("dotenv").config({ path: "./config.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// async function upload(file) {
//   // Convert buffer to data url
//   const fileStr = file.buffer.toString("base64");
//   const fileDataUrl = `data:${file.mimetype};base64,${fileStr}`;

//   // Upload file to cloudinary
//   await cloudinary.uploader.upload(fileDataUrl, (error, result) => {
//     if (error) {
//       throw new Error("Failed to upload file to cloudinary");
//     }
//     return result.secure_url;
//   });
// }
async function upload(file) {
  // Convert buffer to data url
  const fileStr = file.buffer.toString("base64");
  const fileDataUrl = `data:${file.mimetype};base64,${fileStr}`;

  try {
    // Upload file to cloudinary
    const result = await cloudinary.uploader.upload(fileDataUrl);
    return result.secure_url;
  } catch (error) {
    throw new Error("Failed to upload file to cloudinary");
  }
}
module.exports = upload;
