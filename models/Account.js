const mongoose = require("mongoose");
const Order = require("./Order");

const accountSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  passwordHash: String,
  passwordSalt: String,
  phone: String,
  orders: [Order.schema],
});

module.exports = mongoose.model("Account", accountSchema);
