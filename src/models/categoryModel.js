const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

categorySchema.statics.getCategories = async function () {
  return this.find();
};

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
