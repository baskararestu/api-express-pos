const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
