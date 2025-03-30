import express from "express";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import viewsRouter from "./routes/views.js";
import { engine } from "express-handlebars";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
//

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

// Configuración de Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Escuchar conexiones WebSocket
io.on("connection", (socket) => {
  console.log("🟢 Usuario conectado");

  socket.on("nuevoProducto", (producto) => {
    io.emit("actualizarProductos", producto);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Usuario desconectado");
  });
});

// Iniciar servidor
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

// Exportar io para usarlo en otros archivos
export { app, io };
