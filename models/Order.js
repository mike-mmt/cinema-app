const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  screeningId: String,
  seats: [String],
  price: Number,
  paid: Boolean,
  date: Date,
});

module.exports = mongoose.model("Order", orderSchema);
