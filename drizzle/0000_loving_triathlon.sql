DO $$ BEGIN
 CREATE TYPE "tipoPregunta" AS ENUM('simple', 'multiple');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "tipoUsuario" AS ENUM('estudiante', 'docente', 'personal_administrativo', 'foraneo', 'personal_tecnico');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(256) NOT NULL,
	"correo" varchar(256) NOT NULL,
	"password" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dependencias" (
	"id" serial PRIMARY KEY NOT NULL,
	"idDependiente" integer NOT NULL,
	"idDependencia" integer NOT NULL,
	"idRespuesta" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "noticias" (
	"id" serial PRIMARY KEY NOT NULL,
	"idAutor" integer NOT NULL,
	"titulo" varchar(256) NOT NULL,
	"resumen" varchar(256) DEFAULT 'Resumen' NOT NULL,
	"contenido" text NOT NULL,
	"fecha" date DEFAULT now() NOT NULL,
	"ultimaEdicion" date DEFAULT now() NOT NULL,
	"urlImagen" varchar(2048) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "preguntas" (
	"id" serial PRIMARY KEY NOT NULL,
	"idSeccion" integer NOT NULL,
	"tipo" "tipoPregunta" NOT NULL,
	"pregunta" varchar(256) NOT NULL,
	"orden" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "respuestas" (
	"id" serial PRIMARY KEY NOT NULL,
	"idPregunta" integer NOT NULL,
	"respuesta" varchar(256) NOT NULL,
	"orden" integer NOT NULL,
	"puntaje" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resultados" (
	"id" serial PRIMARY KEY NOT NULL,
	"idRespuesta" integer NOT NULL,
	"tipoUsuario" "tipoUsuario" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "secciones" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(256) NOT NULL,
	"urlImagen" varchar(2048) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "nombreIndex" ON "admins" ("nombre");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "tituloIndex" ON "noticias" ("titulo");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "nombreIndex" ON "secciones" ("nombre");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dependencias" ADD CONSTRAINT "dependencias_idDependiente_preguntas_id_fk" FOREIGN KEY ("idDependiente") REFERENCES "preguntas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dependencias" ADD CONSTRAINT "dependencias_idDependencia_preguntas_id_fk" FOREIGN KEY ("idDependencia") REFERENCES "preguntas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dependencias" ADD CONSTRAINT "dependencias_idRespuesta_respuestas_id_fk" FOREIGN KEY ("idRespuesta") REFERENCES "respuestas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "noticias" ADD CONSTRAINT "noticias_idAutor_admins_id_fk" FOREIGN KEY ("idAutor") REFERENCES "admins"("id") ON DELETE no action ON UPDATE no action;
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
