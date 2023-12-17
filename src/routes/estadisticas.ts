import { Router } from "express";
import { db } from "../../db/db";
import { preguntas, respuestas, resultados, secciones } from "../../db/schema";
import { eq } from "drizzle-orm";

export const statsRouter = Router();

type StatType = {
  estadisticas: {
    pregunta: string;
    resultados: {
      respuesta: string;
      total: number;
    }[];
  }[];
};

/**
 * GET /api/estadisticas
 * Devuelve todas las estadisticas
 */
statsRouter.get("/", async (_req, res) => {
  try {
    // Sacar info de db
    const rows = await db
      .select()
      .from(secciones)
      .leftJoin(preguntas, eq(secciones.id, preguntas.idSeccion))
      .leftJoin(respuestas, eq(preguntas.id, respuestas.idPregunta))
      .leftJoin(resultados, eq(respuestas.id, resultados.idRespuesta));
    // Ordenar
    const estadisticas = rows.reduce<Record<string, StatType>>((acc, row) => {
      const { secciones, preguntas, respuestas, resultados } = row;
      // Agregar sección si no existe
      if (!acc[secciones.nombre]) {
        acc[secciones.nombre] = {
          estadisticas: [],
        };
      }
      const seccion = acc[secciones.nombre];
      // Agregar pregunta si no existe
      if (
        !seccion.estadisticas.find((e) => e.pregunta === preguntas?.pregunta!)
      ) {
        seccion.estadisticas.push({
          pregunta: preguntas?.pregunta!,
          resultados: [],
        });
      }
      const pregunta = seccion.estadisticas.find(
        (e) => e.pregunta === preguntas?.pregunta!
      )!;
      // Agregar respuesta si no existe
      if (
        !pregunta.resultados.find((r) => r.respuesta === respuestas?.respuesta!)
      ) {
        pregunta.resultados.push({
          respuesta: respuestas?.respuesta!,
          total: 0,
        });
      }
      // Aumentar total del resultado
      for (const resultado of pregunta.resultados) {
        if (resultados && resultado.respuesta === respuestas?.respuesta!) {
          resultado.total++;
        }
      }
      return acc;
    }, {});
    // Convertir a array
    const estadisticasArray = Object.entries(estadisticas).map(
      ([seccion, estadisticas]) => ({
        seccion,
        estadisticas: estadisticas.estadisticas,
      })
    );
    res.json(estadisticasArray);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al obtener las estadisticas");
  }
});
