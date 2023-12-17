import z from "zod";

export const seccionSchema = z.object({
  nombre: z.string().trim().min(1).max(256),
});
