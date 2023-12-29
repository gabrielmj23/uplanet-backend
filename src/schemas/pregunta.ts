import z from "zod";

export const preguntaSchema = z.object({
  idSeccion: z.number().int(),
  pregunta: z.string().trim().min(1).max(256),
  orden: z.number().int(),
  tipo: z.enum(["simple", "multiple", "rango"]),
  dependencias: z.array(
    z.object({
      idDependencia: z.number().int(),
      idRespuesta: z.number().int(),
    })
  ),
});

export const respuestaSchema = z.object({
  respuesta: z.string().trim().min(1).max(256),
  puntaje: z.number(),
});

export const rangoSchema = z
  .object({
    minimo: z.number().int().min(0),
    maximo: z.number().int().positive(),
    puntajeUnidad: z.number(),
  })
  .refine((rango) => rango.minimo < rango.maximo, {
    message: "El valor mínimo debe ser menor al máximo",
  });
