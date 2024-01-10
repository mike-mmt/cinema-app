const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  passwordHash: String,
  passwordSalt: String,
  phone: String,
  isAdmin: Boolean,
  orders: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Order" }],
});

module.exports = mongoose.model("Account", accountSchema);
