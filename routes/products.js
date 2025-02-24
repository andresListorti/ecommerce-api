import express from "express";
import fs from "fs";
import { io } from "../server.js"; // Importar io desde el servidor principal

const router = express.Router();
const filePath = "./data/products.json";

// Función para leer productos
const readProducts = () => {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

// Función para escribir productos
const writeProducts = (products) => {
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
};

// Obtener todos los productos
router.get("/", (req, res) => {
  let products = readProducts();
  const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
  res.json(products.slice(0, limit));
});

// Obtener un producto por ID
router.get("/:pid", (req, res) => {
  const products = readProducts();
  const product = products.find((p) => p.id === req.params.pid);
  product
    ? res.json(product)
    : res.status(404).json({ error: "Producto no encontrado" });
});

// Agregar un nuevo producto y emitir actualización vía WebSockets
router.post("/", (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } =
    req.body;
  if (!title || !description || !code || !price || !stock || !category) {
    return res
      .status(400)
      .json({ error: "Todos los campos son obligatorios, excepto thumbnails" });
  }

  let products = readProducts();
  const newProduct = {
    id: (products.length + 1).toString(),
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails: thumbnails || [],
    status: true,
  };

  products.push(newProduct);
  writeProducts(products);

  io.emit("actualizarProductos", products); // Emitir evento WebSocket

  res.status(201).json(newProduct);
});

// Actualizar un producto y emitir actualización vía WebSockets
router.put("/:pid", (req, res) => {
  let products = readProducts();
  const index = products.findIndex((p) => p.id === req.params.pid);
  if (index === -1)
    return res.status(404).json({ error: "Producto no encontrado" });

  products[index] = { ...products[index], ...req.body, id: products[index].id };
  writeProducts(products);

  io.emit("actualizarProductos", products); // Emitir evento WebSocket

  res.json(products[index]);
});

// Eliminar un producto y emitir actualización vía WebSockets
router.delete("/:pid", (req, res) => {
  let products = readProducts();
  const newProducts = products.filter((p) => p.id !== req.params.pid);
  if (products.length === newProducts.length)
    return res.status(404).json({ error: "Producto no encontrado" });

  writeProducts(newProducts);

  io.emit("actualizarProductos", newProducts); // Emitir evento WebSocket

  res.json({ message: "Producto eliminado" });
});

export default router;

// import express from "express";
// import fs from "fs";
// const router = express.Router();

// const filePath = "./data/products.json";

// // Función para leer productos
// const readProducts = () => {
//   if (!fs.existsSync(filePath)) return [];
//   const data = fs.readFileSync(filePath);
//   return JSON.parse(data);
// };

// // Función para escribir productos
// const writeProducts = (products) => {
//   fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
// };

// // Obtener todos los productos
// router.get("/", (req, res) => {
//   let products = readProducts();
//   const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
//   res.json(products.slice(0, limit));
// });

// // Obtener un producto por ID
// router.get("/:pid", (req, res) => {
//   const products = readProducts();
//   const product = products.find((p) => p.id === req.params.pid);
//   product
//     ? res.json(product)
//     : res.status(404).json({ error: "Producto no encontrado" });
// });

// // Agregar un nuevo producto
// router.post("/", (req, res) => {
//   const { title, description, code, price, stock, category, thumbnails } =
//     req.body;
//   if (!title || !description || !code || !price || !stock || !category) {
//     return res
//       .status(400)
//       .json({ error: "Todos los campos son obligatorios, excepto thumbnails" });
//   }

//   let products = readProducts();
//   const newProduct = {
//     id: (products.length + 1).toString(),
//     title,
//     description,
//     code,
//     price,
//     stock,
//     category,
//     thumbnails: thumbnails || [],
//     status: true,
//   };

//   products.push(newProduct);
//   writeProducts(products);
//   res.status(201).json(newProduct);
// });

// // Actualizar un producto
// router.put("/:pid", (req, res) => {
//   let products = readProducts();
//   const index = products.findIndex((p) => p.id === req.params.pid);
//   if (index === -1)
//     return res.status(404).json({ error: "Producto no encontrado" });

//   products[index] = { ...products[index], ...req.body, id: products[index].id };
//   writeProducts(products);
//   res.json(products[index]);
// });

// // Eliminar un producto
// router.delete("/:pid", (req, res) => {
//   let products = readProducts();
//   const newProducts = products.filter((p) => p.id !== req.params.pid);
//   if (products.length === newProducts.length)
//     return res.status(404).json({ error: "Producto no encontrado" });

//   writeProducts(newProducts);
//   res.json({ message: "Producto eliminado" });
// });

// export default router;
