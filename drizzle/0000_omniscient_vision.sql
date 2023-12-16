DO $$ BEGIN
 CREATE TYPE "tipoUsuario" AS ENUM('estudiante', 'docente', 'personal_administrativo', 'foraneo', 'personal_tecnico');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(256),
	"correo" varchar(256),
	"password" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "noticias" (
	"id" serial PRIMARY KEY NOT NULL,
	"idAutor" integer,
	"titulo" varchar(256),
	"contenido" varchar(2048),
	"fecha" date DEFAULT now(),
	"ultimaEdicion" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "predecesoresPregunta" (
	"id" serial PRIMARY KEY NOT NULL,
	"idPregunta" integer,
	"idRespuesta" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "preguntas" (
	"id" serial PRIMARY KEY NOT NULL,
	"idSeccion" integer,
	"pregunta" varchar(256),
	"orden" integer,
	"idTipo" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "respuestas" (
	"id" serial PRIMARY KEY NOT NULL,
	"idPregunta" integer,
	"respuesta" varchar(256),
	"orden" integer,
	"puntaje" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resultados" (
	"id" serial PRIMARY KEY NOT NULL,
	"idRespuesta" integer,
	"tipoUsuario" "tipoUsuario"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "secciones" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tiposPregunta" (
	"id" serial PRIMARY KEY NOT NULL,
	"tipo" varchar(256)
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "nombreIndex" ON "admins" ("nombre");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "tituloIndex" ON "noticias" ("titulo");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "nombreIndex" ON "secciones" ("nombre");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "tipoIndex" ON "tiposPregunta" ("tipo");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "noticias" ADD CONSTRAINT "noticias_idAutor_admins_id_fk" FOREIGN KEY ("idAutor") REFERENCES "admins"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "predecesoresPregunta" ADD CONSTRAINT "predecesoresPregunta_idPregunta_preguntas_id_fk" FOREIGN KEY ("idPregunta") REFERENCES "preguntas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "predecesoresPregunta" ADD CONSTRAINT "predecesoresPregunta_idRespuesta_respuestas_id_fk" FOREIGN KEY ("idRespuesta") REFERENCES "respuestas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "preguntas" ADD CONSTRAINT "preguntas_idSeccion_secciones_id_fk" FOREIGN KEY ("idSeccion") REFERENCES "secciones"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "preguntas" ADD CONSTRAINT "preguntas_idTipo_tiposPregunta_id_fk" FOREIGN KEY ("idTipo") REFERENCES "tiposPregunta"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "respuestas" ADD CONSTRAINT "respuestas_idPregunta_preguntas_id_fk" FOREIGN KEY ("idPregunta") REFERENCES "preguntas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resultados" ADD CONSTRAINT "resultados_idRespuesta_respuestas_id_fk" FOREIGN KEY ("idRespuesta") REFERENCES "respuestas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
