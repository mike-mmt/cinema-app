const mongoose = require("mongoose");

const screeningSchema = new mongoose.Schema({
  movieId: String,
  date: Date,
  type: String,
  sound: String,
  seats: [
    {
      row: String,
      number: Number,
      class: String,
      taken: Boolean,
    },
  ],
});

module.exports = mongoose.model("Screening", screeningSchema);
