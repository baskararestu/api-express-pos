const Order = require("../models/orderModel");

const orderController = {
  createOrder: async (req, res) => {
    try {
      const { products } = req.body;

      const existingOrder = await Order.findOne({
        status: "unpaid",
        cashier: req.user._id,
      });

      if (existingOrder) {
        products.forEach((newProduct) => {
          const existingProduct = existingOrder.products.find((product) =>
            product.product.equals(newProduct.product)
          );

          if (existingProduct) {
            existingProduct.quantity += newProduct.quantity;
          } else {
            existingOrder.products.push(newProduct);
          }
        });

        existingOrder.totalPrice = existingOrder.products.reduce(
          (total, product) => total + product.productPrice * product.quantity,
          0
        );

        const updatedOrder = await existingOrder.save();

        res.status(200).json({
          message: "Products added to existing order successfully",
          order: updatedOrder,
        });
      } else {
        const totalPrice = products.reduce(
          (total, product) => total + product.productPrice * product.quantity,
          0
        );

        const newOrder = new Order({
          products,
          totalPrice,
          cashier: req.user._id,
        });

        const savedOrder = await newOrder.save();

        res.status(201).json({
          message: "Order created successfully",
          order: savedOrder,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  completeOrder: async (req, res) => {
    try {
      const orderId = req.params.id;

      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (order.status === "unpaid") {
        order.status = "complete";
        await order.save();
        res.status(200).json({ message: "Order completed successfully" });
      } else {
        res.status(400).json({ message: "Order cannot be completed" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find()
        .populate({
          path: "products.product",
          model: "Product",
          select: "name",
        })
        .populate({
          path: "cashier",
          model: "Admin",
          select: "username",
        });

      res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getUnpaidOrders: async (req, res) => {
    try {
      const unpaidOrders = await Order.find({ status: "unpaid" }).populate(
        "products.product"
      );
      res.status(200).json(unpaidOrders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  completeOrder: async (req, res) => {
    try {
      const orderId = req.params.id;

      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (order.status === "unpaid") {
        order.cashier = req.user._id;
        order.status = "complete";

        await order.save();

        res.status(200).json({ message: "Order completed successfully" });
      } else {
        res.status(400).json({ message: "Order cannot be completed" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = orderController;
