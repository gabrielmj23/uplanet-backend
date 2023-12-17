import { Router } from "express";
import { adminLoginSchema } from "../schemas/admin";
import { db } from "../../db/db";
import { admins } from "../../db/schema";
import { DrizzleError, eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { ZodError } from "zod";

export const authRouter = Router();

/**
 * POST /api/auth/login
 * Iniciar sesión
 */
authRouter.post("/login", async (req, res) => {
  try {
    // Validar body
    const adminLogin = adminLoginSchema.parse(req.body);
    // Buscar admin por correo
    const adminCorreo = await db
      .select()
      .from(admins)
      .where(eq(admins.correo, adminLogin.correo));
    if (adminCorreo.length === 0) {
      return res.status(404).json({ error: "Correo no registrado" });
    }
    // Comparar contraseñas
    const adminDB = adminCorreo[0];
    const passwordMatch = await bcrypt.compare(
      adminLogin.password,
      adminDB.password!
    );
    if (!passwordMatch) {
      return res.status(400).json({ error: "Correo o contraseña incorrectos" });
    }
    // Iniciar sesión
    const token = jwt.sign(
      { id: adminDB.id, nombre: adminDB.nombre, correo: adminDB.correo },
      process.env.JWT_SECRET as jwt.Secret
    );
    res.json({ id: adminDB.id, token });
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
