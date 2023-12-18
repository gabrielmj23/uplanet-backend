import { Router } from "express";
import { db } from "../../db/db";
import {
  preguntas,
  respuestas,
  secciones,
  tiposPregunta,
} from "../../db/schema";
import { eq } from "drizzle-orm";
import { preguntaSchema, respuestaSchema } from "../schemas/pregunta";

export const preguntasRouter = Router();

/**
 * GET /api/preguntas
 * Devuelve todas las preguntas
 */
preguntasRouter.get("/", async (_req, res) => {
  try {
    const results = await db.query.secciones.findMany({
      with: {
        preguntas: {
          with: {
            respuestas: true,
          },
        },
      },
    });
    res.json({ preguntas: results });
  } catch (error) {
    res.status(500).json({ error });
  }
});

/**
 * POST /api/preguntas
 * Crea una nueva pregunta
 */
preguntasRouter.post("/", async (req, res) => {
  try {
    // Validar pregunta
    const { respuestas, nombreSeccion, ...preguntaParsed } = preguntaSchema.parse(req.body);
    // Buscar tipo de pregunta
    const tipo = await db
      .select({ id: tiposPregunta.id })
      .from(tiposPregunta)
      .where(eq(tiposPregunta.tipo, preguntaParsed.tipo));
    if (!tipo) {
      return res.status(400).json({ error: "Tipo de pregunta inválido" });
    }
    const tipoId = tipo[0].id;
    // Buscar id de sección
    const seccion = await db
      .select({ id: secciones.id })
      .from(secciones)
      .where(eq(secciones.nombre, nombreSeccion));
    if (!seccion) {
      return res.status(400).json({ error: "Sección inválida" });
    }
    const seccionId = seccion[0].id;
    // Crear pregunta
    await db.insert(preguntas).values({
      idSeccion: seccionId,
      idTipo: tipoId,
      ...preguntaParsed,
    });
    // Responder
    res.status(200);
  } catch (error) {
    res.status(500).json({ error });
  }
});

/**
 * POST /api/preguntas/:id/respuestas
 * Crea una nueva respuesta para la pregunta con id :id
 */
preguntasRouter.post("/:id/respuestas", async (req, res) => {
  try {
    // Validar respuesta
    const preguntaId = parseInt(req.params.id);
    const pregunta = await db
      .select({ id: preguntas.id })
      .from(preguntas)
      .where(eq(preguntas.id, preguntaId));
    if (!pregunta.length) {
      return res.status(400).json({ error: "Pregunta inválida" });
    }
    const respuesta = respuestaSchema.parse(req.body);
    // Crear respuesta
    await db.insert(respuestas).values({
      idPregunta: preguntaId,
      ...respuesta,
    });
    // Responder
    res.status(200);
  } catch (error) {
    res.status(500).json({ error });
  }
});
