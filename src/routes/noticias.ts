import { Router } from "express";
import { db } from "../../db/db";
import { noticiaSchema } from "../schemas/noticia";
import { noticias } from "../../db/schema";
import { and, desc, eq } from "drizzle-orm";
import { authProtected } from "../utils";

export const noticiasRouter = Router();

/**
 * GET /api/noticias
 * Devuelve todas las noticias
 */
noticiasRouter.get("/", async (_req, res) => {
  try {
    const notis = await db.query.noticias.findMany({
      with: {
        autor: { columns: { nombre: true, id: true } },
      },
      orderBy: [desc(noticias.fecha)],
      limit: 40,
    });
    res.json({ noticias: notis });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

/**
 * POST /api/noticias
 * Crear una noticia
 */
noticiasRouter.post("/", authProtected, async (req, res) => {
  try {
    // Validar datos enviados
    const noticiaParsed = noticiaSchema.parse(req.body);
    // Crear noticia en BD
    const noticia = await db
      .insert(noticias)
      .values({ ...noticiaParsed })
      .returning({
        id: noticias.id,
        titulo: noticias.titulo,
        contenido: noticias.contenido,
        idAutor: noticias.idAutor,
        fecha: noticias.fecha,
      });
    res.json({ noticia });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

/**
 * PUT /api/noticias/:id
 * Actualizar una noticia
 */
noticiasRouter.put("/:id", authProtected, async (req, res) => {
  try {
    // Validar datos enviados
    const noticiaParsed = noticiaSchema.parse(req.body);
    // Actualizar noticia en BD
    const noticia = await db
      .update(noticias)
      .set({ ...noticiaParsed })
      .where(eq(noticias.id, Number(req.params.id)))
      .returning({
        id: noticias.id,
        titulo: noticias.titulo,
        contenido: noticias.contenido,
        idAutor: noticias.idAutor,
        fecha: noticias.fecha,
      });
    res.json({ noticia });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

/**
 * DELETE /api/noticias/:id
 * Eliminar una noticia
 */
noticiasRouter.delete("/:id", authProtected, async (req, res) => {
  try {
    // Eliminar noticia en BD
    const noticia = await db
      .delete(noticias)
      .where(
        and(
          eq(noticias.id, Number(req.params.id)),
          eq(noticias.idAutor, req.user?.id)
        )
      )
      .returning({
        id: noticias.id,
        titulo: noticias.titulo,
        contenido: noticias.contenido,
        idAutor: noticias.idAutor,
        fecha: noticias.fecha,
      });
    res.json({ noticia });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});
