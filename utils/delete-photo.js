// function for deleteing the photo from the database as well as from the cloud
const Photo = require("../models/Photo");
const cloudinary = require("cloudinary").v2;
require("dotenv").config({ path: "./config.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function deletePhoto(id) {
  const deletePhotoQuery = await Photo.findByIdAndDelete(id);
  if (deletePhotoQuery._doc.type === "cloudinary") {
    await cloudinary.uploader.destroy(deletePhotoQuery._doc.cloudinaryPublicId);
  }
  return deletePhotoQuery;
}

module.exports = deletePhoto;
