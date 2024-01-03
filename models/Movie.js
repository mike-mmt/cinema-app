const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: String,
  year: Number,
  genre: String,
  director: String,
  actors: [{ firstName: String, lastName: String }],
  mainPhotoId: String,
  galleryPhotoIds: [String],
});

module.exports = mongoose.model("Movie", movieSchema);
