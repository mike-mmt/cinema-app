const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: String,
  year: Number,
  genres: [String],
  director: String,
  actors: [String],
  mainPhotoUrl: String,
  galleryPhotoUrls: [String],
  isCurrentlyScreening: Boolean,
});

module.exports = mongoose.model("Movie", movieSchema);
