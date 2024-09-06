import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: ["./src/db/schema/users.ts", "./src/db/schema/expenses.ts"],
  out: "./drizzle",
  dialect: "sqlite",
  verbose: true,
  strict: true,
  dbCredentials: {
    url: "./sqlite.db",
  },
});
