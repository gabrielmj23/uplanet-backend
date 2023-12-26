import { Router } from "express";
import { db } from "../../db/db";
import { secciones } from "../../db/schema";
import { seccionSchema } from "../schemas/seccion";
import { authProtected } from "../utils";
import multer from "multer";

export const seccionesRouter = Router();

// Para subir imágenes
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, "public/secciones");
    },
    filename: (_req, file, cb) => {
      const sufijo = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + sufijo + ".webp");
    },
  }),
});

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
seccionesRouter.post(
  "/",
  authProtected,
  upload.single("imagenFondo"),
  async (req, res) => {
    try {
      // Validar sección
      const seccionParsed = seccionSchema.parse(req.body);
      // Validar archivo
      if (!req.file) {
        throw new Error("No se envió una imagen");
      }
      // Crear sección
      const [seccion] = await db
        .insert(secciones)
        .values({ ...seccionParsed, urlImagen: req.file.path })
        .returning({
          id: secciones.id,
          nombre: secciones.nombre,
          urlImagen: secciones.urlImagen,
        });
      // Responder
      res.json({ seccion });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }
);
