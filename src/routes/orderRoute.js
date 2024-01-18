const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, orderController.createOrder);
router.patch("/:id/complete", authMiddleware, orderController.completeOrder);
router.get("/", authMiddleware, orderController.getAllOrders);
router.get("/unpaid", authMiddleware, orderController.getUnpaidOrders);
router.get("/:id/complete", authMiddleware, orderController.completeOrder);

module.exports = router;
