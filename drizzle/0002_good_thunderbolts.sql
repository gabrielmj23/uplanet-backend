CREATE TABLE IF NOT EXISTS "recomendaciones" (
	"id" serial PRIMARY KEY NOT NULL,
	"idRespuesta" integer NOT NULL,
	"recomendacion" varchar(512) NOT NULL,
	"urlImagen" varchar(2048) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recomendaciones" ADD CONSTRAINT "recomendaciones_idRespuesta_respuestas_id_fk" FOREIGN KEY ("idRespuesta") REFERENCES "respuestas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
