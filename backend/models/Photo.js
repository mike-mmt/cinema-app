const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  type: String,
  cloudinaryPublicId: String,
  url: String,
});

module.exports = mongoose.model("Photo", photoSchema);
