import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, conn } from "./db";

function main() {
  migrate(db, { migrationsFolder: "drizzle" })
    .then(() => conn.end())
    .catch((err) => console.error(err))
    .finally(() => console.log("Listo"));
}
main();
