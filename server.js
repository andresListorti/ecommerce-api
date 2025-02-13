//const express = require("express");
import express from "express";
const app = express();
// const productsRouter = require("./routes/products");
// const cartsRouter = require("./routes/carts");
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";

app.use(express.json()); // Para manejar JSON en las peticiones

// Configurar rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Escuchar en el puerto 8080
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
