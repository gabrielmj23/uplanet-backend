import { Router } from "express";
import { db } from "../../db/db";
import {
  preguntas,
  respuestas,
  secciones,
  tiposPregunta,
} from "../../db/schema";
import { eq } from "drizzle-orm";
import { preguntaSchema } from "../schemas/pregunta";

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
    const preguntaParsed = preguntaSchema.parse(req.body);
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
      .where(eq(secciones.nombre, preguntaParsed.nombreSeccion));
    if (!seccion) {
      return res.status(400).json({ error: "Sección inválida" });
    }
    const seccionId = seccion[0].id;
    await db.transaction(async (tx) => {
      // Crear pregunta
      const nuevaPregunta = await tx
        .insert(preguntas)
        .values({
          idSeccion: seccionId,
          pregunta: preguntaParsed.pregunta,
          orden: preguntaParsed.orden,
          idTipo: tipoId,
        })
        .returning({ idPregunta: preguntas.id });
      // Crear respuestas
      await tx.insert(respuestas).values(
        preguntaParsed.respuestas.map((r) => ({
          idPregunta: nuevaPregunta[0].idPregunta,
          ...r,
        }))
      );
    });
    // Responder
    res.status(200);
  } catch (error) {
    res.status(500).json({ error });
  }
});
