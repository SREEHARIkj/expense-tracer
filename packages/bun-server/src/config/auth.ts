import { Lucia } from "lucia";

import { BunSQLiteAdapter } from "@lucia-auth/adapter-sqlite";
import { sqlite } from "./db_config";
import type { SelectUser } from "../db/schema/users";

const adapter = new BunSQLiteAdapter(sqlite, {
  // table names
  user: "users",
  session: "sessions",
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.email,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: SelectUser;
  }
}

// const session = await lucia.createSession(userId, {});
// await lucia.validateSession(session.id);
