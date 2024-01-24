const uploadFile = require("../utils/upload-to-cloudinary");
const Photo = require("../models/Photo");

async function newPhotoFromUrl(url) {
  const databasePhoto = await new Photo({
    type: "external",
    url: url,
  }).save();
  return databasePhoto._id;
}
async function newPhotosFromUrlArray(urlArray) {
  const databasePhotos = urlArray.map((url) => {
    return {
      type: "external",
      url: url,
    };
  });
  const insertPhotosQuery = await Photo.insertMany(databasePhotos); // insertMany doesnt run middleware!
  return insertPhotosQuery.map((photo) => photo._id); // return ids
}
async function newPhotosFromFileArray(fileArray) {
  const cloudPhotos = await Promise.all(
    fileArray.map(async (file) => await uploadFile(file))
  );
  const databasePhotos = cloudPhotos.map((cloudPhoto) => {
    return {
      type: "cloudinary",
      cloudinaryPublicId: cloudPhoto.public_id,
      url: cloudPhoto.secure_url,
    };
  });
  const insertPhotosQuery = await Photo.insertMany(databasePhotos);
  return insertPhotosQuery.map((photo) => photo._id);
}

async function newPhotoFromFile(file) {
  const cloudPhoto = await uploadFile(file);
  const databasePhoto = await new Photo({
    type: "cloudinary",
    cloudinaryPublicId: cloudPhoto.public_id,
    url: cloudPhoto.secure_url,
  }).save();
  return databasePhoto._id;
}

module.exports = {
  newPhotoFromFile,
  newPhotoFromUrl,
  newPhotosFromFileArray,
  newPhotosFromUrlArray,
};
