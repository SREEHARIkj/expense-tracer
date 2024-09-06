import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import z from "zod";
import type { Context } from "../utils/context";

export const test = new Hono<Context>()
  .get("/", (c) => {
    return c.text("test route");
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        text: z.string(),
      })
    ),
    async (c) => {
      const session = c.get("session");

      if (!session) {
        return c.json(
          { error: `unauthorized request, please login agin` },
          401
        );
      }
      const { text } = c.req.valid("json");
      // return c.text(`this is text form client ${text}`, 200);
      return c.json({ data: `this is text form client ${text}` }, 200);
    }
  );
