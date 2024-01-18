const Product = require("../models/productModel");

const productController = {
  createProduct: async (req, res) => {
    try {
      const { name, price, categoryId } = req.body;

      const newProduct = new Product({
        name,
        price,
        category: categoryId,
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
};

module.exports = productController;
