import z from "zod";

export const preguntaSchema = z.object({
  nombreSeccion: z.string(),
  pregunta: z.string().trim().min(1).max(256),
  orden: z.number().int(),
  tipo: z.string(),
  respuestas: z.array(
    z.object({
      respuesta: z.string().trim().min(1).max(256),
      orden: z.number().int(),
      puntaje: z.number().positive(),
    })
  ).optional(),
});

export const respuestaSchema = z.object({
  respuesta: z.string().trim().min(1).max(256),
  orden: z.number().int(),
  puntaje: z.number().positive(),
});
