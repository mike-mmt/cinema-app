const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  screeningId: { type: mongoose.SchemaTypes.ObjectId, ref: "Screening" },
  seats: [
    {
      row: String,
      number: Number,
      class: String,
    },
  ],
  price: Number,
  paid: Boolean,
  date: Date,
});

module.exports = mongoose.model("Order", orderSchema);
