import { Router } from "express";
import { adminSchema } from "../schemas/admin";
import { ZodError } from "zod";
import * as bcrypt from "bcryptjs";
import { db } from "../../db/db";
import { admins } from "../../db/schema";
import { DrizzleError } from "drizzle-orm";

export const adminsRouter = Router();

/**
 * POST /api/admins
 * Registrar un nuevo administrador
 */
adminsRouter.post("/", async (req, res) => {
  try {
    // Validar body
    const admin = adminSchema.parse(req.body);
    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(admin.password, 10);
    // Registrar en la base de datos
    const nuevoAdmin = await db
      .insert(admins)
      .values({ ...admin, password: hashedPassword })
      .returning({
        id: admins.id,
        nombre: admins.nombre,
        correo: admins.correo,
      });
    res.json({ admin: nuevoAdmin });
  } catch (error) {
    console.error(error);
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    if (error instanceof DrizzleError) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Error interno, " + error });
  }
});
