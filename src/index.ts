import express from "express";
import cors from "cors";

// Crear app
const app = express();
app.use(express.json());
app.use(cors());

// Rutas
app.get("/api", (_req, res) => res.send("Hola mundo"));

// Iniciar
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
