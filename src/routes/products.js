const { Router } = require("express");
const router = Router();

const prisma = require("../prismaClient");
const asyncMap = require("../controllers/asyncMap");
const { verifyToken } = require("../controllers/jwt");
const {
  updateStock,
  getProducts,
  createProduct,
  purchaseProduct,
} = require("../controllers/products");

// Get of products
// El usuario tiene que tener un token de logeo para poder acceder a su carrito
router.get("/", getProducts);

// Product create
// El usuario tiene que tener un token de logeo para poder crear un producto
router.post("/", createProduct);

// Update stock of product
// El usuario tiene que tener un token de logeo para poder actualizar un producto
router.put("/", updateStock);

// Set a purchase
// El usuario tiene que tener un token de logeo para poder agregar productos
router.post("/inventory", purchaseProduct);

module.exports = router;
