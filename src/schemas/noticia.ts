import { z } from "zod";

export const noticiaSchema = z.object({
  idAutor: z.coerce.number().int().positive(),
  titulo: z
    .string()
    .trim()
    .min(1)
    .max(256, { message: "El título debe tener menos de 256 caracteres" }),
  contenido: z
    .string()
    .trim()
    .min(1)
    .max(2048, { message: "El contenido debe tener menos de 2048 caracteres" }),
});

export const actualizarNoticiaSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(1)
    .max(256, { message: "El título debe tener menos de 256 caracteres" })
    .optional(),
  contenido: z
    .string()
    .trim()
    .min(1)
    .max(2048, { message: "El contenido debe tener menos de 2048 caracteres" })
    .optional(),
});
