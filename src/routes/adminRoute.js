const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/", adminController.getAllUsers);
router.post("/signup", adminController.signUpAdmin);
router.post("/signin", adminController.signInAdmin);

module.exports = router;
