const { verifyToken } = require("./jwt");
const prisma = require("../prismaClient");
const asyncMap = require("./asyncMap");

const getProducts = async (req, res) => {
  try {
    const products = await prisma.Product.findMany();
    res.json({ products });
  } catch (error) {
    console.log(error);
    res.json({ error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    verifyToken(token); //Si el token no es válido entrara en el catch
    if (req.body <= 0) {
      return res.status(400).json({ error: "Ingresa un stock válido" });
    }
    const isProductCreated = await prisma.Product.findUnique({
      where: { isbn: req.body.isbn },
    });

    if (isProductCreated) {
      return res.json({
        error: "El producto que intentas crear ya existe en la base de datos",
      });
    }
    const product = await prisma.Product.create({
      data: req.body,
    });
    res.json({ product });
  } catch (error) {
    console.log(error);
    res.json({ error: error.message });
  }
};

const updateStock = async (req, res) => {
  if (req.body.stock >= 0) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      verifyToken(token); //Si el token no es válido entrara en el catch
      if (!req.body.id) {
        return res
          .status(400)
          .json({ error: "Introduce un id de producto válida" });
      }
      if (!(await prisma.Product.findUnique({ where: { id: req.body.id } }))) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      await prisma.Product.update({
        where: { id: req.body.id },
        data: { stock: req.body.stock },
      });
      return res.send("Stock actualizado corréctamente");
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  return res.status(400).json({ error: "Ingresa un stock válido" });
};

const purchaseProduct = async (req, res) => {
  try {
    const { distribuitor, products } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    verifyToken(token); //Si el token no es válido entrara en el catch
    const productsToPurchase = await asyncMap(products, async (product) => {
      const isProductExist = await prisma.Product.findUnique({
        where: { isbn: product.isbn },
      });

      // Si el producto existe, solo actualiza el stock
      if (isProductExist) {
        await prisma.Product.update({
          where: { id: isProductExist.id },
          data: { stock: product.stock + isProductExist.stock },
        });
        return { product: { connect: { id: isProductExist.id } } };
      }

      return { product: { create: product } };
    });

    const purchase = await prisma.Purchase.create({
      data: {
        distribuitor,
        date: new Date(),
        products: {
          create: productsToPurchase,
        },
      },
    });
    res.json({ purchase });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
module.exports = { getProducts, createProduct, updateStock, purchaseProduct };
