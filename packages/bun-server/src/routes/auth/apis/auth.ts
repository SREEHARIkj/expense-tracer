import { Hono } from "hono";
import type { Context } from "../../../utils/context";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Scrypt } from "lucia";
import { getUser, insertUser } from "../../../db/querys/userQuerys";
import { lucia } from "../../../config/auth";
import { SQLiteError } from "bun:sqlite";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const auth = new Hono<Context>()
  .post(
    "/signup",
    zValidator("form", schema, async (result, c) => {
      if (!result.success) {
        return c.redirect(
          `/api/forms/signup-form?message=${encodeURIComponent(result.error.message)}`
        );
      }
    }),
    async (c) => {
      const { email, password } = c.req.valid("form");

      const passwordHash = await new Scrypt().hash(password);

      try {
        const user = (await insertUser({ email, password: passwordHash }))?.at(
          0
        );

        if (!user) {
          throw new Error("user not added");
        }

        const session = await lucia.createSession(user.id, {});
        const cookie = lucia.createSessionCookie(session.id);

        c.header("Set-Cookie", cookie.serialize(), { append: true });
      } catch (e) {
        if (
          e instanceof SQLiteError &&
          e?.code === "SQLITE_CONSTRAINT_UNIQUE"
        ) {
          return c.redirect(
            `/api/forms/signup-form?message=${encodeURIComponent(JSON.stringify([{ message: "Username already used" }]))}`
          );
        }

        return c.redirect(
          `/api/forms/signup-form?message=${encodeURIComponent(JSON.stringify([{ message: "Unknown issue ocurred" }]))}`
        );
      }

      return c.redirect("/api/forms/user-logout");
    }
  )
  .post(
    "/login",
    zValidator("form", schema, async (result, c) => {
      if (!result.success) {
        return c.redirect(
          `/api/forms/login-form?message=${encodeURIComponent(result.error.message)}`
        );
      }
    }),
    async (c) => {
      const { email, password } = c.req.valid("form");

      try {
        const existingUser = (await getUser(email))?.at(0);
        if (!existingUser) {
          throw new Error("user not found");
        }
        const verifyPassword = new Scrypt().verify(
          existingUser.password,
          password
        );

        if (!verifyPassword) {
          throw new Error("password incorrect");
        }

        const session = await lucia.createSession(existingUser.id, {});
        c.header(
          "Set-Cookie",
          lucia.createSessionCookie(session.id).serialize(),
          { append: true }
        );
        c.header("Location", "/", { append: true });
      } catch (e) {
        return c.redirect(
          `/api/forms/login-form?message=${encodeURIComponent(JSON.stringify([{ message: (e as unknown as Error).message }]))}`
        );
      }

      // return c.redirect("/api/forms/user-logout");
      return c.redirect("/");
      // return c.json({ message: "log in success" }, 200);
    }
  )
  .get("/logout", async (c) => {
    const session = c.get("session");
    if (!session) {
      return c.body(null, 401);
    }
    await lucia.invalidateSession(session.id);
    c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize());
    // return c.redirect("/api/forms/login-form");
    return c.json(
      {
        redirectUrl: "/api/forms/login-form",
      },
      200
    );
  });
