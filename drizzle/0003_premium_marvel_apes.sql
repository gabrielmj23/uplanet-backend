ALTER TYPE "tipoPregunta" ADD VALUE 'rango';--> statement-breakpoint
ALTER TYPE "tipoUsuario" ADD VALUE 'Estudiante';--> statement-breakpoint
ALTER TYPE "tipoUsuario" ADD VALUE 'Docente';--> statement-breakpoint
ALTER TYPE "tipoUsuario" ADD VALUE 'Personal Administrativo';--> statement-breakpoint
ALTER TYPE "tipoUsuario" ADD VALUE 'Foráneo';--> statement-breakpoint
ALTER TYPE "tipoUsuario" ADD VALUE 'Otro Personal';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rangos" (
	"id" serial PRIMARY KEY NOT NULL,
	"idPregunta" integer NOT NULL,
	"minimo" integer NOT NULL,
	"maximo" integer NOT NULL,
	"puntajeUnidad" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resultadosRangos" (
	"id" serial PRIMARY KEY NOT NULL,
	"idPregunta" integer NOT NULL,
	"tipoUsuario" "tipoUsuario" NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rangos" ADD CONSTRAINT "rangos_idPregunta_preguntas_id_fk" FOREIGN KEY ("idPregunta") REFERENCES "preguntas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resultadosRangos" ADD CONSTRAINT "resultadosRangos_idPregunta_respuestas_id_fk" FOREIGN KEY ("idPregunta") REFERENCES "respuestas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
