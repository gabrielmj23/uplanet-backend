import { z } from "zod";

export const encuestaSchema = z.object({
  tipoUsuario: z.enum([
    "Estudiante",
    "Docente",
    "Personal Administrativo",
    "Otro Personal",
    "Foráneo",
  ]),
  secciones: z.array(
    z.object({
      id: z.number().int().positive(),
      preguntas: z.array(
        z.object({
          id: z.number().int().positive(),
          tipo: z.enum(["simple", "multiple", "rango"]),
          respuestas: z
            .array(
              z.object({
                idRespuesta: z.number().int().positive(),
                puntaje: z.number(),
              })
            )
            .optional(),
          rango: z.object({
            valor: z.number(),
            puntajeUnidad: z.number(),
          }).optional(),
        })
      ),
    })
  ),
});
