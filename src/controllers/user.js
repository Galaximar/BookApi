const bcrypt = require("bcryptjs");
const prisma = require("../prismaClient");
const { generateToken, verifyToken } = require("./jwt");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ error: "Email inválido" });
    const userExist = await prisma.User.findUnique({ where: { email } });
    if (userExist) {
      return res.status(409).json({ error: "Este email ya está registrado" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.User.create({
      data: { name, email, password: hashedPassword },
    });
    res.json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.User.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "El usuario no existe" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }
    // Genera un token JWT y lo envía al usuario
    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.json({ error: error.message });
  }
};

const editPerfilUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { id } = verifyToken(token);
    const { photo, address } = req.body;
    const updateData = {};
    if (!photo && !address)
      res.status(400).json({ error: "Campos incompletos" });
    if (photo) updateData.photo = photo;
    if (address) updateData.address = address;
    const user = await prisma.User.update({
      where: { id },
      data: updateData,
    });
    res.json({ user });
  } catch (error) {
    console.log(error);
    res.json({ error: error.message });
  }
};
module.exports = { register, login, editPerfilUser };
