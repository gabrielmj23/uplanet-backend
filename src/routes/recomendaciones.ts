import { Router } from "express";
import multer from "multer";
import { db } from "../../db/db";
import { recomendaciones } from "../../db/schema";
import { authProtected } from "../utils";
import { recomendacionSchema } from "../schemas/recomendacion";

export const recomendacionesRouter = Router();

// Para subir imágenes
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, "public/recomendaciones");
    },
    filename: (_req, file, cb) => {
      const sufijo = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + sufijo + ".webp");
    },
  }),
});

/**
 * GET /api/recomendaciones?idSeccion=<idSeccion>
 * Devuelve todas las recomendaciones
 */
recomendacionesRouter.get("/", async (req, res) => {
  try {
    if (!req.query.idSeccion) {
      // Caso de todas las recomendaciones
      const rows = await db.query.recomendaciones.findMany({
        with: {
          respuesta: {
            with: {
              pregunta: true,
            },
          },
        },
      });
      return res.json({ recomendaciones: rows });
    }
    // Caso de recomendaciones por sección
    const idSeccion = Number(req.query.idSeccion);
    const rows = await db.query.recomendaciones.findMany({
      with: {
        respuesta: {
          with: {
            pregunta: true,
          },
        },
      },
    });
    res.json({
      recomendaciones: rows
        .filter((rec) => rec.respuesta.pregunta.idSeccion === idSeccion)
        .map((rec) => ({
          id: rec.id,
          idRespuesta: rec.idRespuesta,
          recomendacion: rec.recomendacion,
          urlImagen: rec.urlImagen,
        })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

/**
 * POST /api/recomendaciones
 * Crear una recomendación
 */
recomendacionesRouter.post(
  "/",
  authProtected,
  upload.single("icono"),
  async (req, res) => {
    try {
      // Validar sección
      const recomendacionParsed = recomendacionSchema.parse(req.body);
      // Validar archivo
      if (!req.file) {
        throw new Error("No se envió una imagen");
      }
      // Crear sección
      const [recomendacion] = await db
        .insert(recomendaciones)
        .values({ ...recomendacionParsed, urlImagen: req.file.path })
        .returning({
          id: recomendaciones.id,
          idRespuesta: recomendaciones.idRespuesta,
          recomendacion: recomendaciones.recomendacion,
          urlImagen: recomendaciones.urlImagen,
        });
      // Responder
      res.json({ recomendacion });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }
);
