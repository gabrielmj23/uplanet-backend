import { relations } from "drizzle-orm";
import {
  date,
  doublePrecision,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

// Tipos de usuarios que responden la encuesta
export const tipoUsuarioEnum = pgEnum("tipoUsuario", [
  "Estudiante",
  "Docente",
  "Personal Administrativo",
  "Foráneo",
  "Otro Personal",
]);
export type TipoUsuario = (typeof tipoUsuarioEnum.enumValues)[number];

// Tipos de preguntas
export const tipoPreguntaEnum = pgEnum("tipoPregunta", [
  "simple",
  "multiple",
  "rango",
]);
export type TipoPregunta = (typeof tipoPreguntaEnum.enumValues)[number];

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

// Tabla de noticias
export const noticias = pgTable(
  "noticias",
  {
    id: serial("id").primaryKey(),
    idAutor: integer("idAutor")
      .references(() => admins.id)
      .notNull(),
    titulo: varchar("titulo", { length: 256 }).notNull(),
    resumen: varchar("resumen", { length: 256 }).notNull().default("Resumen"),
    contenido: text("contenido").notNull(),
    fecha: date("fecha").defaultNow().notNull(),
    ultimaEdicion: date("ultimaEdicion").defaultNow().notNull(),
    urlImagen: varchar("urlImagen", { length: 2048 }).notNull(),
  },
  (noticias) => ({
    tituloIndex: uniqueIndex("tituloIndex").on(noticias.titulo),
  })
);
export const noticiasRelations = relations(noticias, ({ one }) => ({
  autor: one(admins, { fields: [noticias.idAutor], references: [admins.id] }),
}));
export type Noticia = typeof noticias.$inferSelect;

// Tabla de secciones
export const secciones = pgTable(
  "secciones",
  {
    id: serial("id").primaryKey(),
    nombre: varchar("nombre", { length: 256 }).notNull(),
    urlImagen: varchar("urlImagen", { length: 2048 }).notNull(),
  },
  (secciones) => ({
    nombreIndex: uniqueIndex("nombreIndex").on(secciones.nombre),
  })
);
export const seccionesRelations = relations(secciones, ({ many }) => ({
  preguntas: many(preguntas),
}));
export type Seccion = typeof secciones.$inferSelect;

// Tabla de preguntas
export const preguntas = pgTable("preguntas", {
  id: serial("id").primaryKey(),
  idSeccion: integer("idSeccion")
    .references(() => secciones.id, {
      onDelete: "cascade",
    })
    .notNull(),
  tipo: tipoPreguntaEnum("tipo").notNull(),
  pregunta: varchar("pregunta", { length: 256 }).notNull(),
  orden: integer("orden").notNull(),
});
export const preguntasRelations = relations(preguntas, ({ one, many }) => ({
  seccion: one(secciones, {
    fields: [preguntas.idSeccion],
    references: [secciones.id],
  }),
  respuestas: many(respuestas),
  rangos: many(rangos),
  dependencias: many(dependencias),
  resultadosRangos: many(resultadosRangos),
}));
export type Pregunta = typeof preguntas.$inferSelect;

// Tabla de respuestas
export const respuestas = pgTable("respuestas", {
  id: serial("id").primaryKey(),
  idPregunta: integer("idPregunta")
    .references(() => preguntas.id, {
      onDelete: "cascade",
    })
    .notNull(),
  respuesta: varchar("respuesta", { length: 256 }).notNull(),
  puntaje: integer("puntaje").notNull(),
});
export const respuestasRelations = relations(respuestas, ({ one, many }) => ({
  pregunta: one(preguntas, {
    fields: [respuestas.idPregunta],
    references: [preguntas.id],
  }),
  dependencias: many(dependencias),
  resultados: many(resultados),
  recomendaciones: many(recomendaciones),
}));
export type Respuesta = typeof respuestas.$inferSelect;

// Tabla de rangos para respuestas basadas en rango
export const rangos = pgTable("rangos", {
  id: serial("id").primaryKey(),
  idPregunta: integer("idPregunta")
    .references(() => preguntas.id, {
      onDelete: "cascade",
    })
    .notNull(),
  minimo: integer("minimo").notNull(),
  maximo: integer("maximo").notNull(),
  puntajeUnidad: integer("puntajeUnidad").notNull(),
});
export const rangosRelations = relations(rangos, ({ one }) => ({
  pregunta: one(preguntas, {
    fields: [rangos.idPregunta],
    references: [preguntas.id],
  }),
}));
export type Rango = typeof rangos.$inferSelect;

// Tabla de dependencias de preguntas
export const dependencias = pgTable("dependencias", {
  id: serial("id").primaryKey(),
  idDependiente: integer("idDependiente")
    .references(() => preguntas.id, {
      onDelete: "cascade",
    })
    .notNull(),
  idDependencia: integer("idDependencia")
    .references(() => preguntas.id, {
      onDelete: "cascade",
    })
    .notNull(),
  idRespuesta: integer("idRespuesta")
    .references(() => respuestas.id, {
      onDelete: "cascade",
    })
    .notNull(),
});
export const dependenciasRelations = relations(dependencias, ({ one }) => ({
  dependencia: one(preguntas, {
    fields: [dependencias.idDependiente],
    references: [preguntas.id],
  }),
  respuesta: one(respuestas, {
    fields: [dependencias.idRespuesta],
    references: [respuestas.id],
  }),
}));
export type Dependencia = typeof dependencias.$inferSelect;

// Tabla de resultados
export const resultados = pgTable("resultados", {
  id: serial("id").primaryKey(),
  idRespuesta: integer("idRespuesta")
    .references(() => respuestas.id, {
      onDelete: "cascade",
    })
    .notNull(),
  tipoUsuario: tipoUsuarioEnum("tipoUsuario").notNull(),
  fecha: date("fecha").defaultNow().notNull(),
});
export const resultadosRelations = relations(resultados, ({ one }) => ({
  respuesta: one(respuestas, {
    fields: [resultados.idRespuesta],
    references: [respuestas.id],
  }),
}));
export type Resultado = typeof resultados.$inferSelect;

// Tabla de resultados de rangos
export const resultadosRangos = pgTable("resultadosRangos", {
  id: serial("id").primaryKey(),
  idPregunta: integer("idPregunta")
    .references(() => preguntas.id, {
      onDelete: "cascade",
    })
    .notNull(),
  tipoUsuario: tipoUsuarioEnum("tipoUsuario").notNull(),
  valor: integer("valor").notNull(),
  fecha: date("fecha").defaultNow().notNull(),
});
export const resultadosRangosRelations = relations(
  resultadosRangos,
  ({ one }) => ({
    pregunta: one(preguntas, {
      fields: [resultadosRangos.idPregunta],
      references: [preguntas.id],
    }),
  })
);
export type ResultadoRango = typeof resultadosRangos.$inferSelect;

export const huellas = pgTable("huellas", {
  id: serial("id").primaryKey(),
  huella: doublePrecision("huella").notNull(),
  tipoUsuario: tipoUsuarioEnum("tipoUsuario").notNull(),
});

// Tabla de recomendaciones
export const recomendaciones = pgTable("recomendaciones", {
  id: serial("id").primaryKey(),
  idRespuesta: integer("idRespuesta")
    .references(() => respuestas.id, {
      onDelete: "cascade",
    })
    .notNull(),
  recomendacion: varchar("recomendacion", { length: 512 }).notNull(),
  urlImagen: varchar("urlImagen", { length: 2048 }).notNull(),
});
export const recomendacionesRelations = relations(
  recomendaciones,
  ({ one }) => ({
    respuesta: one(respuestas, {
      fields: [recomendaciones.idRespuesta],
      references: [respuestas.id],
    }),
  })
);
export type Recomendacion = typeof recomendaciones.$inferSelect;
