const jwt = require("jsonwebtoken");

// Función para generar tokens
const generateToken = (user) => {
  const token = jwt.sign(
    { id: user.id, nombre: user.name, email: user.email },
    process.env.JWT, // Clave secreta del token
    { expiresIn: "8h" }
  );
  return token;
};

// Función para verificar tokens
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT);
    return decoded;
  } catch (error) {
    throw new Error("Token inválido");
  }
};

module.exports = { verifyToken, generateToken };
