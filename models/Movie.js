const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: String,
  year: Number,
  genres: [String],
  director: String,
  actors: [String],
  mainPhotoId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Photo",
  },
  galleryPhotoIds: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "Photo",
  },
  isCurrentlyScreening: Boolean,
});

module.exports = mongoose.model("Movie", movieSchema);
