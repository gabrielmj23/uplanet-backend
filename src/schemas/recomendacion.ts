import { z } from "zod";

export const recomendacionSchema = z.object({
  idRespuesta: z.number().int().positive(),
  recomendacion: z.string().min(1).max(512, {
    message: "La recomendación debe tener menos de 512 caracteres",
  }),
});
