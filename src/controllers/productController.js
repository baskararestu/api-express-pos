const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Order = require("../models/orderModel");

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

  updateProduct: async (req, res) => {
    try {
      const productId = req.params.id;
      const { name, price, categoryId } = req.body;

      const existingProduct = await Product.findById(productId);

      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      const isProductSold = await Order.exists({
        "products.product": existingProduct._id,
        status: "complete",
      });

      if (isProductSold) {
        const newProduct = new Product({
          name,
          price,
          category: categoryId,
          isActive: true,
        });

        existingProduct.isActive = false;

        const savedProduct = await newProduct.save();
        await existingProduct.save();

        return res.status(200).json({
          message: "Product updated successfully",
          product: savedProduct,
        });
      } else {
        existingProduct.name = name;
        existingProduct.price = price;
        existingProduct.category = categoryId;

        const savedProduct = await existingProduct.save();

        return res.status(200).json({
          message: "Product updated successfully",
          product: savedProduct,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const productId = req.params.id;

      const existingProduct = await Product.findById(productId);

      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      const isProductSold = await Order.exists({
        "products.product": existingProduct._id,
        status: "complete",
      });

      if (isProductSold) {
        existingProduct.isActive = false;
        await existingProduct.save();

        return res.status(200).json({
          message: "Product deleted successfully",
          product: existingProduct,
        });
      } else {
        await Product.deleteOne({ _id: existingProduct._id });
        return res.status(200).json({
          message: "Product deleted successfully",
          product: existingProduct,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = productController;
