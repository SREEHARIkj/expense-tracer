import { migrate } from "drizzle-orm/bun-sqlite/migrator";

import { db, sqlite } from "./src/config/db_config";

await migrate(db, { migrationsFolder: "./drizzle" });

sqlite.close();
