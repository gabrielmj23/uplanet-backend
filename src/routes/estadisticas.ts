import { Router } from "express";
import { db } from "../../db/db";
import { TipoUsuario, huellas } from "../../db/schema";
import { avg, sql } from "drizzle-orm";

export const statsRouter = Router();

/**
 * GET /api/estadisticas/huellaTotal
 * Devuelve la huella total de cada tipo de usuario
 */
statsRouter.get("/huellaTotal", async (_req, res) => {
  try {
    // Obtener todos los resultados por tipo
    const resultados = await db.query.resultados.findMany({
      with: {
        respuesta: true,
      },
    });
    const resultadosPorTipo = resultados.reduce(
      (acc: Record<TipoUsuario, number>, result) => {
        const tipo = result.tipoUsuario;
        if (!acc[tipo]) {
          acc[tipo] = 0;
        }
        acc[tipo] += result.respuesta.puntaje;
        return acc;
      },
      Object.create(null)
    );

    // Hacer lo mismo para los rangos
    const resultadosRgo = await db.query.resultadosRangos.findMany({
      with: {
        pregunta: {
          columns: {
            id: true,
          },
          with: {
            rangos: true,
          },
        },
      },
    });
    const rangosPorTipo = resultadosRgo.reduce(
      (acc: Record<TipoUsuario, number>, rgo) => {
        const tipo = rgo.tipoUsuario;
        if (!acc[tipo]) {
          acc[tipo] = 0;
        }
        acc[tipo] += rgo.valor * rgo.pregunta.rangos[0].puntajeUnidad;
        return acc;
      },
      Object.create(null)
    );

    // Determinar huella de cada grupo
    const huellaPorTipo = Object.keys(resultadosPorTipo).reduce(
      (acc: Record<TipoUsuario, number>, tipo) => {
        const tu = tipo as TipoUsuario;
        acc[tu] = (resultadosPorTipo[tu] + rangosPorTipo[tu]) / 10000;
        return acc;
      },
      Object.create(null)
    );
    res.json({ huellaPorTipo });
  } catch (error) {
    res.status(500).json({ error });
  }
});

/**
 * GET /api/estadisticas/promedios
 * Devuelve los promedios de huella de cada tipo de usuario
 */
statsRouter.get("/promedios", async (_req, res) => {
  try {
    // Obtener huellas de BD
    const huellasBd = await db.select().from(huellas);
    const huellasPorTipo = huellasBd.reduce(
      (acc: Record<TipoUsuario, { cuenta: number; suma: number }>, huella) => {
        const tipo = huella.tipoUsuario;
        if (!acc[tipo]) {
          acc[tipo] = { cuenta: 0, suma: 0 };
        }
        acc[tipo] = {
          cuenta: acc[tipo].cuenta + 1,
          suma: acc[tipo].suma + huella.huella,
        };
        return acc;
      },
      Object.create(null)
    );
    const promediosPorTipo = Object.keys(huellasPorTipo).reduce(
      (
        acc: Record<TipoUsuario, { promedio: number; cuenta: number }>,
        tipo
      ) => {
        const tipoUsuario = tipo as TipoUsuario;
        acc[tipoUsuario] = {
          promedio:
            huellasPorTipo[tipoUsuario].suma /
            huellasPorTipo[tipoUsuario].cuenta,
          cuenta: huellasPorTipo[tipoUsuario].cuenta,
        };
        return acc;
      },
      Object.create(null)
    );
    res.json({ promediosPorTipo });
  } catch (error) {
    res.status(500).json({ error });
  }
});

/**
 * GET /api/estadisticas/secciones
 * Devuelve las estadísticas de cada sección
 */
statsRouter.get("/secciones", async (_req, res) => {
  try {
    const secciones = await db.query.secciones.findMany({
      with: {
        preguntas: {
          columns: {
            id: true,
            pregunta: true,
            tipo: true,
          },
          with: {
            respuestas: {
              columns: {
                respuesta: true,
              },
              with: {
                resultados: {
                  columns: {
                    tipoUsuario: true,
                  },
                },
              },
            },
            rangos: {
              columns: {
                puntajeUnidad: true,
              },
            },
            resultadosRangos: {
              columns: {
                tipoUsuario: true,
                valor: true,
              },
            },
          },
        },
      },
    });
    res.json({ secciones });
  } catch (error) {
    res.status(500).json({ error });
  }
});
