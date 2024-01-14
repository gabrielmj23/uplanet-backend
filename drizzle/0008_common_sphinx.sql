ALTER TABLE "resultadosRangos" DROP CONSTRAINT "resultadosRangos_idPregunta_respuestas_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resultadosRangos" ADD CONSTRAINT "resultadosRangos_idPregunta_preguntas_id_fk" FOREIGN KEY ("idPregunta") REFERENCES "preguntas"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
