const express = require("express");
const dotenv = require("dotenv");
const db = require("./database/db"); //cannot be deleted
const adminRoutes = require("./routes/adminRoute");
const categoryRoutes = require("./routes/categoryRoute");
const productRoutes = require("./routes/productRoute");
const orderRoutes = require("./routes/orderRoute");

dotenv.config();
const app = express();
const BASE_URL = "/api";

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes setup
app.use(`${BASE_URL}/admins`, adminRoutes);
app.use(`${BASE_URL}/categories`, categoryRoutes);
app.use(`${BASE_URL}/products`, productRoutes);
app.use(`${BASE_URL}/orders`, orderRoutes);

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
