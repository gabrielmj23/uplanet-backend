ALTER TABLE "dependencias" DROP CONSTRAINT "dependencias_idDependiente_preguntas_id_fk";
--> statement-breakpoint
ALTER TABLE "preguntas" DROP CONSTRAINT "preguntas_idSeccion_secciones_id_fk";
--> statement-breakpoint
ALTER TABLE "rangos" DROP CONSTRAINT "rangos_idPregunta_preguntas_id_fk";
--> statement-breakpoint
ALTER TABLE "recomendaciones" DROP CONSTRAINT "recomendaciones_idRespuesta_respuestas_id_fk";
--> statement-breakpoint
ALTER TABLE "respuestas" DROP CONSTRAINT "respuestas_idPregunta_preguntas_id_fk";
--> statement-breakpoint
ALTER TABLE "resultados" DROP CONSTRAINT "resultados_idRespuesta_respuestas_id_fk";
--> statement-breakpoint
ALTER TABLE "resultadosRangos" DROP CONSTRAINT "resultadosRangos_idPregunta_respuestas_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dependencias" ADD CONSTRAINT "dependencias_idDependiente_preguntas_id_fk" FOREIGN KEY ("idDependiente") REFERENCES "preguntas"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "preguntas" ADD CONSTRAINT "preguntas_idSeccion_secciones_id_fk" FOREIGN KEY ("idSeccion") REFERENCES "secciones"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rangos" ADD CONSTRAINT "rangos_idPregunta_preguntas_id_fk" FOREIGN KEY ("idPregunta") REFERENCES "preguntas"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recomendaciones" ADD CONSTRAINT "recomendaciones_idRespuesta_respuestas_id_fk" FOREIGN KEY ("idRespuesta") REFERENCES "respuestas"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "respuestas" ADD CONSTRAINT "respuestas_idPregunta_preguntas_id_fk" FOREIGN KEY ("idPregunta") REFERENCES "preguntas"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resultados" ADD CONSTRAINT "resultados_idRespuesta_respuestas_id_fk" FOREIGN KEY ("idRespuesta") REFERENCES "respuestas"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resultadosRangos" ADD CONSTRAINT "resultadosRangos_idPregunta_respuestas_id_fk" FOREIGN KEY ("idPregunta") REFERENCES "respuestas"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
