import express from "express";
import cors from "cors";
import "dotenv/config";

// Crear app
const app = express();
app.use(express.json());
app.use(cors());

// Importar routers
import { adminsRouter } from "./routes/admins";
import { authRouter } from "./routes/auth";
import { statsRouter } from "./routes/estadisticas";
import { preguntasRouter } from "./routes/preguntas";
import { seccionesRouter } from "./routes/secciones";

// Rutas
app.get("/api", (_req, res) => res.send("Hola mundo"));
app.use("/api/auth", authRouter);
app.use("/api/admins", adminsRouter);
app.use("/api/estadisticas", statsRouter);
app.use("/api/preguntas", preguntasRouter);
app.use("/api/secciones", seccionesRouter);

// Iniciar
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
