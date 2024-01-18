// controllers/categoryController.js
const Category = require("../models/categoryModel");

const categoryController = {
  createCategory: async (req, res) => {
    try {
      const { name } = req.body;

      const newCategory = new Category({
        name,
      });

      const savedCategory = await newCategory.save();

      return res.status(201).json({
        message: "Category created successfully",
        category: savedCategory,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = categoryController;
