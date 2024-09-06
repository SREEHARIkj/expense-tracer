import { Hono } from "hono";
import type { Context } from "../../utils/context";
import {
  deleteExpense,
  getAllExpenses,
  insertExpense,
} from "../../db/querys/expenseQuerys";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { SQLiteError } from "bun:sqlite";

const DebitPostSchema = z.object({
  date: z.string().transform((str) => new Date(str)),
  amount: z.union([z.string(), z.null(), z.undefined()]),
  merchant: z.union([z.string(), z.null(), z.undefined()]),
  category_id: z.union([z.number(), z.null(), z.undefined()]),
});

export const debitRoute = new Hono<Context>()
  .get("/", async (c) => {
    const session = c.get("session");

    if (!session) {
      return c.json(
        { error: "You must be logged in to access this page." },
        401
      );
    }

    const allIncome = await getAllExpenses();
    return c.json(allIncome, 200);
  })
  .post("/", zValidator("form", DebitPostSchema), async (c) => {
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
      incomeData = (await insertExpense(payload)).at(0);
      if (!incomeData) {
        return c.json({ error: "Error inserting expense" }, 500);
      }
    } catch (e) {
      if (e instanceof SQLiteError && e?.code === "SQLITE_CONSTRAINT_UNIQUE") {
        return c.json({ error: "Expense already exists" }, 500);
      }
      return c.json({ error: "Error inserting expense" }, 500);
    }

    return c.json({
      message: "Expense inserted successfully",
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
      const payload = c.req.valid("json");
      if (!session) {
        return c.json(
          { error: "You must be logged in to access this page." },
          401
        );
      }
      const ids = payload.ids;

      let x: { deletedId: number }[];

      try {
        x = await deleteExpense(ids);
      } catch (error) {
        return c.json({ error: "Error deleting expense" }, 500);
      }
      return c.json(
        {
          message: "Expense deleted successfully",
          data: x,
        },
        200
      );
    }
  );
