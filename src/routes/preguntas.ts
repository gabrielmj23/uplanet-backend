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

type PreguntaType = {
  id: number;
  pregunta: string;
  tipo: string;
  respuestas: {
    id: number;
    respuesta: string;
    puntaje: number;
  }[];
};

/**
 * GET /api/preguntas
 * Devuelve todas las preguntas
 */
preguntasRouter.get("/", async (_req, res) => {
  try {
    // Buscar secciones, preguntas y respuestas
    const rows = await db
      .select()
      .from(secciones)
      .leftJoin(preguntas, eq(secciones.id, preguntas.idSeccion))
      .leftJoin(tiposPregunta, eq(preguntas.idTipo, tiposPregunta.id))
      .leftJoin(respuestas, eq(preguntas.id, respuestas.idPregunta));
    // Acomodar
    const preg = rows.reduce<Record<string, PreguntaType[]>>((acc, row) => {
      const { secciones, preguntas, respuestas, tiposPregunta } = row;
      // Agregar sección si no existe
      if (!acc[secciones.nombre]) {
        acc[secciones.nombre] = [];
      }
      // Agregar pregunta si no existe
      if (!acc[secciones.nombre].find((p) => p.id === preguntas?.id)) {
        acc[secciones.nombre].push({
          id: preguntas?.id!,
          pregunta: preguntas?.pregunta!,
          tipo: tiposPregunta?.tipo!,
          respuestas: [],
        });
        // Agregar respuesta
        for (const p of acc[secciones.nombre]) {
          if (p.id === preguntas?.id) {
            p.respuestas.push({
              id: respuestas?.id!,
              respuesta: respuestas?.respuesta!,
              puntaje: respuestas?.puntaje!,
            });
          }
        }
      }
      return acc;
    }, {});
    // Convertir a array
    const ans = Object.entries(preg).map(([seccion, preguntas]) => ({
      seccion,
      preguntas,
    }));
    res.json(ans);
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
