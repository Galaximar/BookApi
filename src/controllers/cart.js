const prisma = require("../prismaClient");
const asyncMap = require("./asyncMap");
const { verifyToken } = require("./jwt");

const getCart = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { id: userId } = verifyToken(token); //Si el token no es válido entrara en el catch
    console.log("aaaaaaaaaaaaaaaaaaa", userId);
    const user = await prisma.User.findUnique({
      where: { id: userId },
      include: {
        cart: { include: { products: { include: { product: true } } } },
      },
    });
    if (!user.cart) {
      return res.status(404).json({ error: "No tienes un carrito asignado" });
    }
    res.json({ cart: user.cart });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: error.message });
  }
};

const addOrCreateCart = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { id: userId } = verifyToken(token); //Si el token no es válido entrara en el catch
    const { products } = req.body;
    const productsToCart = products.map((product) => {
      return {
        quantity: product.quantity,
        product: { connect: { id: product.id } },
      };
    });

    const userWithCart = await prisma.User.findUnique({
      where: { id: userId },
      include: {
        cart: true,
      },
    });
    if (!userWithCart) {
      return res.status(404).json({ error: "Usuario no asignado al carrito" });
    }

    for (let index = 0; index < products.length; index++) {
      const product = await prisma.Product.findUnique({
        where: { id: products[index].id },
      });
      if (products[index].quantity > product.stock)
        return res
          .status(404)
          .json({ error: "Tienes producto/s fuera de stock" });
    }

    // Verifica si el usuario tiene un carro creado
    if (userWithCart?.cart) {
      // Si tiene un carro creado, actualiza el carro
      const cart = await asyncMap(products, async (product) => {
        return await prisma.cartItem.upsert({
          where: {
            cartId_productId: {
              productId: product.id,
              cartId: userWithCart.cart.id,
            },
          },
          update: { quantity: product.quantity },
          create: {
            quantity: product.quantity,
            cartId: userWithCart.cart.id,
            productId: product.id,
          },
        });
      });

      return res.json({ cart });
    }

    // Si no tiene un carro creado, lo crea con los productos enviados
    const cart = await prisma.Cart.create({
      data: {
        user: { connect: { id: userId } },
        products: { create: productsToCart },
      },
    });

    res.json({ cart });
  } catch (error) {
    console.log(error);
    res.json({ error: error.message });
  }
};

const buy = async (req, res) => {
  try {
    const { cartId } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    const { id: userId } = verifyToken(token); //Si el token no es válido entrara en el catch
    const user = await prisma.User.findUnique({
      where: { cartId },
    });
    if (!user) {
      return res.status(404).json({ error: "No tienes ningun carrito armado" });
    }
    if (user.id !== userId) {
      return res.status(404).json({
        error: "El carro que deseas eliminar no coincide con tu usuario",
      });
    }

    const cart = await prisma.Cart.findUnique({
      where: { id: cartId },
      include: { products: { include: { product: true } } },
    });

    const isInvalidCart = cart.products.some(
      ({ product: { stock }, quantity }) => {
        return stock - quantity < 0;
      }
    );
    if (isInvalidCart)
      return res.status(207).json({ error: "Tienes productos fuera de stock" });
    await asyncMap(
      cart.products,
      async ({ product: { id, stock }, quantity }) => {
        return await prisma.product.update({
          where: { id },
          data: { stock: stock - quantity },
        });
      }
    );

    // Borra todos los cartItem asociados con el carrito específico
    await prisma.CartItem.deleteMany({ where: { cartId: cartId } });

    // Borra el carrito
    await prisma.Cart.delete({ where: { id: cartId } });

    res.send("Compra realizada con éxito");
  } catch (error) {
    console.log(error);
    res.json({ error: error.message });
  }
};

module.exports = { getCart, addOrCreateCart, buy };
