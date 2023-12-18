import { relations } from "drizzle-orm";
import {
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

// Tipos de usuarios que responden la encuesta
export const tipoUsuarioEnum = pgEnum("tipoUsuario", [
  "estudiante",
  "docente",
  "personal_administrativo",
  "foraneo",
  "personal_tecnico",
]);

// Tabla de administradores
export const admins = pgTable(
  "admins",
  {
    id: serial("id").primaryKey(),
    nombre: varchar("nombre", { length: 256 }).notNull(),
    correo: varchar("correo", { length: 256 }).notNull(),
    password: varchar("password", { length: 256 }).notNull(),
  },
  (admins) => ({
    nombreIndex: uniqueIndex("nombreIndex").on(admins.nombre),
  })
);
export const adminsRelations = relations(admins, ({ many }) => ({
  noticias: many(noticias),
}));
export type Admin = typeof admins.$inferSelect;
export type NuevoAdmin = typeof admins.$inferInsert;

// Tabla de noticias
export const noticias = pgTable(
  "noticias",
  {
    id: serial("id").primaryKey(),
    idAutor: integer("idAutor")
      .references(() => admins.id)
      .notNull(),
    titulo: varchar("titulo", { length: 256 }).notNull(),
    contenido: varchar("contenido", { length: 2048 }).notNull(),
    fecha: date("fecha").defaultNow().notNull(),
    ultimaEdicion: date("ultimaEdicion").defaultNow().notNull(),
  },
  (noticias) => ({
    tituloIndex: uniqueIndex("tituloIndex").on(noticias.titulo),
  })
);
export const noticiasRelations = relations(noticias, ({ one }) => ({
  autor: one(admins, { fields: [noticias.idAutor], references: [admins.id] }),
}));
export type Noticia = typeof noticias.$inferSelect;
export type NuevaNoticia = typeof noticias.$inferInsert;

// Tabla de secciones
export const secciones = pgTable(
  "secciones",
  {
    id: serial("id").primaryKey(),
    nombre: varchar("nombre", { length: 256 }).notNull(),
  },
  (secciones) => ({
    nombreIndex: uniqueIndex("nombreIndex").on(secciones.nombre),
  })
);
export const seccionesRelations = relations(secciones, ({ many }) => ({
  preguntas: many(preguntas),
}));
export type Seccion = typeof secciones.$inferSelect;
export type NuevaSeccion = typeof secciones.$inferInsert;

// Tabla de tipos de pregunta
export const tiposPregunta = pgTable(
  "tiposPregunta",
  {
    id: serial("id").primaryKey(),
    tipo: varchar("tipo", { length: 256 }).notNull(),
  },
  (tiposRespuesta) => ({
    tipoIndex: uniqueIndex("tipoIndex").on(tiposRespuesta.tipo),
  })
);
export const tiposPreguntaRelations = relations(tiposPregunta, ({ many }) => ({
  preguntas: many(preguntas),
}));
export type TipoPregunta = typeof tiposPregunta.$inferSelect;
export type NuevoTipoPregunta = typeof tiposPregunta.$inferInsert;

// Tabla de preguntas
export const preguntas = pgTable("preguntas", {
  id: serial("id").primaryKey(),
  idSeccion: integer("idSeccion")
    .references(() => secciones.id)
    .notNull(),
  pregunta: varchar("pregunta", { length: 256 }).notNull(),
  orden: integer("orden").notNull(),
  idTipo: integer("idTipo")
    .references(() => tiposPregunta.id)
    .notNull(),
});
export const preguntasRelations = relations(preguntas, ({ one, many }) => ({
  seccion: one(secciones, {
    fields: [preguntas.idSeccion],
    references: [secciones.id],
  }),
  tipo: one(tiposPregunta, {
    fields: [preguntas.idTipo],
    references: [tiposPregunta.id],
  }),
  respuestas: many(respuestas),
  predecesoresPregunta: many(predecesoresPregunta),
}));
export type Pregunta = typeof preguntas.$inferSelect;
export type NuevaPregunta = typeof preguntas.$inferInsert;

// Tabla de respuestas
export const respuestas = pgTable("respuestas", {
  id: serial("id").primaryKey(),
  idPregunta: integer("idPregunta")
    .references(() => preguntas.id)
    .notNull(),
  respuesta: varchar("respuesta", { length: 256 }).notNull(),
  orden: integer("orden").notNull(),
  puntaje: integer("puntaje").notNull(),
});
export const respuestasRelations = relations(respuestas, ({ one, many }) => ({
  pregunta: one(preguntas, {
    fields: [respuestas.idPregunta],
    references: [preguntas.id],
  }),
  predecesoresPregunta: many(predecesoresPregunta),
  resultados: many(resultados),
}));
export type Respuesta = typeof respuestas.$inferSelect;
export type NuevaRespuesta = typeof respuestas.$inferInsert;

// Tabla de predecesores
export const predecesoresPregunta = pgTable("predecesoresPregunta", {
  id: serial("id").primaryKey(),
  idPregunta: integer("idPregunta")
    .references(() => preguntas.id)
    .notNull(),
  idRespuesta: integer("idRespuesta")
    .references(() => respuestas.id)
    .notNull(),
});
export const predecesoresPreguntaRelations = relations(
  predecesoresPregunta,
  ({ one }) => ({
    pregunta: one(preguntas, {
      fields: [predecesoresPregunta.idPregunta],
      references: [preguntas.id],
    }),
    respuesta: one(respuestas, {
      fields: [predecesoresPregunta.idRespuesta],
      references: [respuestas.id],
    }),
  })
);
export type PredecesorPregunta = typeof predecesoresPregunta.$inferSelect;
export type NuevoPredecesorPregunta = typeof predecesoresPregunta.$inferInsert;

// Tabla de resultados
export const resultados = pgTable("resultados", {
  id: serial("id").primaryKey(),
  idRespuesta: integer("idRespuesta")
    .references(() => respuestas.id)
    .notNull(),
  tipoUsuario: tipoUsuarioEnum("tipoUsuario").notNull(),
});
export const resultadosRelations = relations(resultados, ({ one }) => ({
  respuesta: one(respuestas, {
    fields: [resultados.idRespuesta],
    references: [respuestas.id],
  }),
}));
export type Resultado = typeof resultados.$inferSelect;
export type NuevoResultado = typeof resultados.$inferInsert;
