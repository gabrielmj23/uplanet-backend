import z from "zod";

export const preguntaSchema = z.object({
  idSeccion: z.number().int(),
  pregunta: z.string().trim().min(1).max(256),
  orden: z.number().int(),
  tipo: z.enum(["simple", "multiple"]),
  dependencias: z.array(
    z.object({
      idDependencia: z.number().int(),
      idRespuesta: z.number().int(),
    })
  ),
});

export const respuestaSchema = z.object({
  respuesta: z.string().trim().min(1).max(256),
  puntaje: z.number().positive(),
});
