const { Router } = require("express");

const userRoutes = require("./user.js");
const productsRoutes = require("./products.js");
const cartRoutes = require("./cart.js");

const router = Router();

router.use("/user", userRoutes);
router.use("/products", productsRoutes);
router.use("/cart", cartRoutes);

module.exports = router;
