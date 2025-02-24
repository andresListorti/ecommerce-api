import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const filePath = path.join(__dirname, "../data/products.json");

// Función para leer productos
const readProducts = () => {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, "utf-8");
  return data ? JSON.parse(data) : [];
};

// Ruta Home - Muestra todos los productos
router.get("/", (req, res) => {
  const products = readProducts();
  res.render("home", { title: "Lista de Productos", products });
});

// Ruta RealTimeProducts - Vista para WebSockets
router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", { title: "Productos en Tiempo Real" });
});

export default router;
