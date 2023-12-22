import { z } from "zod";

export const noticiaSchema = z.object({
  idAutor: z.coerce.number().int().positive(),
  titulo: z
    .string()
    .trim()
    .min(1)
    .max(256, { message: "El título debe tener menos de 256 caracteres" }),
  resumen: z
    .string()
    .trim()
    .min(1)
    .max(256, { message: "El resumen debe tener menos de 256 caracteres" }),
  contenido: z.string().trim().min(1),
});

export const actualizarNoticiaSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(1)
    .max(256, { message: "El título debe tener menos de 256 caracteres" })
    .optional(),
  resumen: z
    .string()
    .trim()
    .min(1)
    .max(256, { message: "El resumen debe tener menos de 256 caracteres" }),
  contenido: z.string().trim().min(1),
});
