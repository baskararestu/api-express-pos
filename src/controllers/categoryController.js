// controllers/categoryController.js
const Category = require("../models/categoryModel");

const categoryController = {
  createCategory: async (req, res) => {
    try {
      const { name } = req.body;

      const existingCategory = await Category.findOne({
        name: name,
      });

      if (existingCategory) {
        return res
          .status(400)
          .json({ message: `Category ${name} already exists` });
      }

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

  getCategoryById: async (req, res) => {
    try {
      const categoryId = req.params.id;

      const category = await Category.findById(categoryId);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.status(200).json({ data: category });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = categoryController;
