const express = require("express");
const fs = require("fs");
const router = express.Router();

const cartPath = "./data/carts.json";

// Función para leer carritos
const readCarts = () => {
  if (!fs.existsSync(cartPath)) return [];
  const data = fs.readFileSync(cartPath);
  return JSON.parse(data);
};

// Función para escribir carritos
const writeCarts = (carts) => {
  fs.writeFileSync(cartPath, JSON.stringify(carts, null, 2));
};

// Crear un nuevo carrito
router.post("/", (req, res) => {
  let carts = readCarts();
  const newCart = { id: (carts.length + 1).toString(), products: [] };
  carts.push(newCart);
  writeCarts(carts);
  res.status(201).json(newCart);
});

// Obtener productos de un carrito
router.get("/:cid", (req, res) => {
  const carts = readCarts();
  const cart = carts.find((c) => c.id === req.params.cid);
  cart
    ? res.json(cart.products)
    : res.status(404).json({ error: "Carrito no encontrado" });
});

// Agregar producto a un carrito
router.post("/:cid/product/:pid", (req, res) => {
  const carts = readCarts();
  const products = require("./products").readProducts(); // Reusar función de productos
  const cart = carts.find((c) => c.id === req.params.cid);
  const product = products.find((p) => p.id === req.params.pid);

  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  if (!product)
    return res.status(404).json({ error: "Producto no encontrado" });

  const existingProduct = cart.products.find(
    (p) => p.product === req.params.pid
  );
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.products.push({ product: req.params.pid, quantity: 1 });
  }

  writeCarts(carts);
  res.json(cart);
});

module.exports = router;
