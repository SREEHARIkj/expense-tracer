import { Hono } from "hono";
import type { Context } from "../../utils/context";
import {
  deleteIncome,
  getAllIncome,
  insertIncome,
} from "../../db/querys/expenseQuerys";
import { zValidator } from "@hono/zod-validator";
import { number, z } from "zod";
import { SQLiteError } from "bun:sqlite";

const incomePostSchema = z.object({
  date: z.string().transform((str) => new Date(str)),
  amount: z.union([z.string(), z.null(), z.undefined()]),
  source: z.union([z.string(), z.null(), z.undefined()]),
  category_id: z.union([z.number(), z.null(), z.undefined()]),
});

export const creditRoute = new Hono<Context>()
  .get("/", async (c) => {
    const session = c.get("session");

    if (!session) {
      return c.json(
        { error: "You must be logged in to access this page." },
        401
      );
    }

    const allIncome = await getAllIncome();
    return c.json(allIncome, 200);
  })
  .post("/", zValidator("form", incomePostSchema), async (c) => {
    const session = c.get("session");
    const payload = c.req.valid("form");

    if (!session) {
      return c.json(
        { error: "You must be logged in to access this page." },
        401
      );
    }
    let incomeData;
    try {
      incomeData = (await insertIncome({ ...payload })).at(0);
      if (!incomeData) {
        return c.json({ error: "Error inserting income" }, 500);
      }
    } catch (e) {
      if (e instanceof SQLiteError && e?.code === "SQLITE_CONSTRAINT_UNIQUE") {
        return c.json({ error: "Income already exists" }, 500);
      }
      return c.json({ error: "Error inserting income" }, 500);
    }

    return c.json({
      message: "Income inserted successfully",
      data: incomeData,
    });
  })
  .delete(
    "/",
    zValidator(
      "json",
      z.object({
        ids: z.array(z.number()),
      })
    ),
    async (c) => {
      const session = c.get("session");
      const { ids } = c.req.valid("json");
      if (!session) {
        return c.json(
          { error: "You must be logged in to access this page." },
          401
        );
      }

      let x: { deletedId: number }[];
      try {
        x = await deleteIncome(ids);
      } catch (e) {
        return c.json({ error: "Error deleting income" }, 500);
      }
      return c.json({ message: "Income deleted successfully", data: x }, 200);
    }
  );
