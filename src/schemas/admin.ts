import { z } from "zod";

export const adminSchema = z.object({
  nombre: z.string().min(1).max(256),
  correo: z.string().email(),
  password: z.string().min(8).max(256),
});

export const adminLoginSchema = z.object({
  correo: z.string().email(),
  password: z.string().min(8).max(256),
});
