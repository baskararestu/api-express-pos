// controllers/userController.js

const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");

const adminController = {
  getAllUsers: async (req, res) => {
    try {
      const admins = await Admin.find();
      res.status(200).json(admins);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  signUpAdmin: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const existingAdmin = await Admin.findOne({
        $or: [{ username }, { email }],
      });

      if (existingAdmin) {
        return res
          .status(400)
          .json({ message: "Username or email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new Admin({
        username,
        email,
        password: hashedPassword,
      });
      const savedAdmin = await newAdmin.save();
      res
        .status(201)
        .json({ message: "Admin registered successfully", admin: savedAdmin });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  signInAdmin: async (req, res) => {
    try {
      const { email, password } = req.body;

      const admin = await Admin.findByCredentials(email, password);

      const token = admin.generateAuthToken();

      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Invalid login credentials" });
    }
  },
};

module.exports = adminController;
