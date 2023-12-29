import { Router } from "express";
import { db } from "../../db/db";
import {
  dependencias,
  preguntas,
  rangos,
  respuestas,
  secciones,
} from "../../db/schema";
import { and, asc, eq } from "drizzle-orm";
import {
  preguntaSchema,
  rangoSchema,
  respuestaSchema,
} from "../schemas/pregunta";
import { authProtected } from "../utils";

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
            dependencias: true,
          },
          orderBy: [asc(preguntas.orden)],
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
preguntasRouter.post("/", authProtected, async (req, res) => {
  try {
    // Validar pregunta
    const { dependencias: deps, ...preguntaParsed } = preguntaSchema.parse(
      req.body
    );
    // Buscar id de sección
    const seccion = await db
      .select({ id: secciones.id })
      .from(secciones)
      .where(eq(secciones.id, preguntaParsed.idSeccion));
    if (!seccion) {
      return res.status(400).json({ error: "Sección inválida" });
    }
    // Crear pregunta y registrar sus dependencias
    let idInsertada;
    await db.transaction(async (tx) => {
      const [{ idPregunta }] = await tx
        .insert(preguntas)
        .values({ ...preguntaParsed })
        .returning({ idPregunta: preguntas.id });
      idInsertada = idPregunta;
      for (const dependencia of deps) {
        await tx.insert(dependencias).values({
          idDependiente: idPregunta,
          ...dependencia,
        });
      }
    });
    // Responder
    res.json({ id: idInsertada });
  } catch (error) {
    res.status(500).json({ error });
  }
});

/**
 * POST /api/preguntas/:id/respuestas
 * Crea una nueva respuesta para la pregunta con id :id
 */
preguntasRouter.post("/:id/respuestas", authProtected, async (req, res) => {
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
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error });
  }
});

/**
 * POST /api/preguntas/:id/rangos
 * Crea un nuevo rango para la pregunta con id :id
 */
preguntasRouter.post("/:id/rangos", authProtected, async (req, res) => {
  try {
    // Validar id de la pregunta
    const preguntaId = parseInt(req.params.id);
    const [pregunta] = await db
      .select({ id: preguntas.id })
      .from(preguntas)
      .where(eq(preguntas.id, preguntaId));
    if (!pregunta) {
      return res.status(404).json({ error: "Pregunta no encontrada" });
    }
    // Validar rango
    const rango = rangoSchema.parse(req.body);
    // Insertar en BD
    await db.insert(rangos).values({
      idPregunta: preguntaId,
      ...rango,
    });
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

/**
 * DELETE /api/preguntas/:id
 * Elimina la pregunta con id :id
 */
preguntasRouter.delete("/:id", authProtected, async (req, res) => {
  try {
    const preguntaId = parseInt(req.params.id);
    // Eliminar pregunta
    await db.delete(preguntas).where(eq(preguntas.id, preguntaId));
    // Responder
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

/**
 * DELETE /api/preguntas/:id/respuestas/:idRespuesta
 * Elimina la respuesta con id :idRespuesta de la pregunta con id :id
 */
preguntasRouter.delete(
  "/:id/respuestas/:idRespuesta",
  authProtected,
  async (req, res) => {
    try {
      const preguntaId = parseInt(req.params.id);
      const respuestaId = parseInt(req.params.idRespuesta);
      // Eliminar respuesta
      await db
        .delete(respuestas)
        .where(
          and(
            eq(respuestas.id, respuestaId),
            eq(respuestas.idPregunta, preguntaId)
          )
        );
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }
);
