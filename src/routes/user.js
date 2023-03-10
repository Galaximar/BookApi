const bcrypt = require("bcryptjs");
const { Router } = require("express");
const router = Router();

const prisma = require("../prismaClient");
const { generateToken, verifyToken } = require("../controllers/jwt");
const { register, login, editPerfilUser } = require("../controllers/user");

router.post("/register", register);

router.post("/login", login);

router.put("/edit", editPerfilUser);
module.exports = router;
