const Product = require("../models/productModel");
const Category = require("../models/categoryModel");

const productController = {
  createProduct: async (req, res) => {
    try {
      const { name, price, categoryId } = req.body;

      const category = await Category.findById(categoryId);
      const existingProduct = await Product.findOne({
        name: name,
        category: categoryId,
      });

      if (existingProduct && existingProduct.isActive) {
        return res.status(400).json({
          message: `Product with name ${name} in category ${category.name} already exists`,
        });
      }

      const newProduct = new Product({
        name,
        price,
        category: categoryId,
        isActive: true,
      });

      const savedProduct = await newProduct.save();

      return res.status(201).json({
        message: "Product created successfully",
        product: savedProduct,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getProducts: async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getProductById: async (req, res) => {
    try {
      const productId = req.params.id;

      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = productController;
