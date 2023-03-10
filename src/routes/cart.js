const { Router } = require("express");
const asyncMap = require("../controllers/asyncMap");
const { buy, addOrCreateCart, getCart } = require("../controllers/cart");
const { verifyToken } = require("../controllers/jwt");
const router = Router();

const prisma = require("../prismaClient");

//Obtiene el carrito
router.get("/", getCart);

//Crea o agrega a un carrito
router.post("/", addOrCreateCart);

//El usuario tiene que tener un token de logeo para poder hacer la compra
router.post("/buy", buy);
module.exports = router;
