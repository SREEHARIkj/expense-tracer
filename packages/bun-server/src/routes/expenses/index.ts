import { Hono } from "hono";
import type { Context } from "../../utils/context";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../../config/db_config";
import { expenses, incomes } from "../../db/schema/expenses";
import { desc } from "drizzle-orm";
import { sumOfExpense, sumOfIncome } from "../../db/querys/expenseQuerys";

const GetTransactionsSchema = z.object({
  limit: z.optional(z.string()),
  offset: z.optional(z.string()),
});

export const transactions = new Hono<Context>()
  .get("/", zValidator("query", GetTransactionsSchema), async (c) => {
    const session = c.get("session");
    const { limit: limitValue = 10, offset: offsetValue = 0 } =
      c.req.valid("query") ?? {};

    if (!session) {
      return c.json(
        { error: "You must be logged in to access this page." },
        401
      );
    }

    const credit = (
      await db
        .select()
        .from(incomes)
        .limit(+limitValue)
        .orderBy(desc(incomes.date))
    )?.map((i) => ({ ...i, type: "credit" }));

    const debit = (
      await db
        .select()
        .from(expenses)
        .limit(+limitValue)
        .orderBy(desc(expenses.date))
    )?.map((i) => ({ ...i, type: "debit" }));

    const transactionList = [...credit, ...debit]
      ?.map((d) => ({ ...d, date: new Date(d.date!).toLocaleDateString() }))
      .reduce((acc: { [key: string]: any[] }, item) => {
        if (!acc[item.date]) {
          acc[item.date] = [];
        }

        acc[item.date].push(item);

        return acc;
      }, {});

    return c.json({ data: transactionList }, 200);
  })
  .get("/overview", async (c) => {
    const session = c.get("session");

    if (!session) {
      return c.json(
        { error: "You must be logged in to access this page." },
        401
      );
    }

    const totalIncome = Number((await sumOfIncome()).at(0)?.total ?? 0);
    const totalExpense = Number((await sumOfExpense()).at(0)?.total ?? 0);
    const balance = totalIncome - totalExpense;
    const savingRate = (
      balance > 0
        ? (balance / totalIncome) * 100
        : -(Math.abs(balance / totalIncome) * 100)
    )?.toFixed(2);

    return c.json(
      {
        income: totalIncome,
        expenses: totalExpense,
        balance,
        savingRate,
      },
      200
    );
  });
