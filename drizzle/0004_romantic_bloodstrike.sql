ALTER TABLE "resultados" ADD COLUMN "fecha" date DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "resultadosRangos" ADD COLUMN "fecha" date DEFAULT now() NOT NULL;