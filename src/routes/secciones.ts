import { Router } from "express";
import { db } from "../../db/db";
import { secciones } from "../../db/schema";
import { seccionSchema } from "../schemas/seccion";

export const seccionesRouter = Router();

/**
 * GET /api/secciones
 * Devuelve todas las secciones
 */
seccionesRouter.get("/", async (_req, res) => {
  try {
    // Buscar secciones
    const rows = await db.select().from(secciones);
    // Responder
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

/**
 * POST /api/secciones
 * Crear una seccion
 */
seccionesRouter.post("/", async (req, res) => {
  try {
    // Validar sección
    const seccionParsed = seccionSchema.parse(req.body);
    // Crear sección
    const [seccion] = await db
      .insert(secciones)
      .values(seccionParsed)
      .returning({
        id: secciones.id,
        nombre: secciones.nombre,
      });
    // Responder
    res.json({ seccion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});
