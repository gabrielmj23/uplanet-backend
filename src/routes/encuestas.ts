import { Router } from "express";
import { encuestaSchema } from "../schemas/encuesta";
import { db } from "../../db/db";
import { resultados, resultadosRangos } from "../../db/schema";

export const encuestasRouter = Router();

/**
 * POST /api/encuestas
 * Guarda los resultados de una encuesta
 */
encuestasRouter.post("/", async (req, res) => {
  try {
    // Validar encuesta
    const encuestaParsed = encuestaSchema.parse(req.body);
    // Obtener respuestas
    const respuestas = encuestaParsed.secciones.flatMap((seccion) =>
      seccion.preguntas
        .filter((pregunta) => pregunta.tipo !== "rango")
        .flatMap(
          (pregunta) =>
            pregunta.respuestas?.map((respuesta) => ({
              idRespuesta: respuesta.idRespuesta,
              tipoUsuario: encuestaParsed.tipoUsuario,
            })) ?? []
        )
    );
    // Obtener rangos
    const rangos = encuestaParsed.secciones.flatMap((seccion) =>
      seccion.preguntas
        .filter((pregunta) => pregunta.tipo === "rango")
        .flatMap((pregunta) => ({
          idPregunta: pregunta.id,
          valor: pregunta.rango?.valor ?? 0,
          tipoUsuario: encuestaParsed.tipoUsuario,
        }))
    );
    // Insertar en BD
    await db.transaction(async (tx) => {
      await tx.insert(resultados).values(respuestas);
      await tx.insert(resultadosRangos).values(rangos);
    });
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});
