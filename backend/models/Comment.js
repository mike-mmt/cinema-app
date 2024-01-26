const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  id: String,
  author: String,
  body: String,
  movieId: { type: mongoose.SchemaTypes.ObjectId, ref: "Movie" },
  likes: Number,
  dislikes: Number,
});

module.exports = mongoose.model("Comment", commentSchema);
