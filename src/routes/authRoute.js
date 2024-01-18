// routes/auth.js

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/admin", authController.registerAdmin);
router.post("/login", authController.login);

module.exports = router;
