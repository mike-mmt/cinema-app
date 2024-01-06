const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: String,
  year: Number,
  genres: [String],
  director: String,
  actors: [String],
  mainPhotoId: mongoose.SchemaTypes.ObjectId,
  galleryPhotoUrls: [String],
  isCurrentlyScreening: Boolean,
});

module.exports = mongoose.model("Movie", movieSchema);
