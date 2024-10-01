import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const incomes = sqliteTable("incomes", {
  income_id: integer("income_id").primaryKey({ autoIncrement: true }).notNull(),
  date: integer("date", { mode: "timestamp" }),

  // date: text("date")
  //   .default(sql`strftime('%Y-%m-%d %H:%M:%f', 'now')`)
  //   .notNull(),
  amount: text("amount"),
  source: text("source"),
  category_id: integer("category_id").references(
    () => incomeCategories.category_id
  ),
});

export type InsertIncomes = typeof incomes.$inferInsert;
export type SelectIncomes = typeof incomes.$inferSelect;

export const incomeCategories = sqliteTable("income_categories", {
  category_id: integer("category_id")
    .primaryKey({ autoIncrement: true })
    .notNull(),
  category_name: text("category_name"),
});

export type InsertIncomeCategories = typeof incomeCategories.$inferInsert;
export type SelectIncomeCategories = typeof incomeCategories.$inferSelect;

export const expenses = sqliteTable("expenses", {
  expense_id: integer("expense_id")
    .primaryKey({ autoIncrement: true })
    .notNull(),
  date: integer("date", { mode: "timestamp" }),
  // date: text("date")
  //   .default(sql`strftime('%Y-%m-%d %H:%M:%f', 'now')`)
  //   .notNull(),
  amount: text("amount"),
  merchant: text("merchant"),
  category_id: integer("category_id").references(
    () => expenseCategories.category_id
  ),
});

export type InsertExpenses = typeof expenses.$inferInsert;
export type SelectExpenses = typeof expenses.$inferSelect;

export const expenseCategories = sqliteTable("expense_categories", {
  category_id: integer("category_id")
    .primaryKey({ autoIncrement: true })
    .notNull(),
  category_name: text("category_name"),
});

export type InsertExpenseCategories = typeof expenseCategories.$inferInsert;
export type SelectExpenseCategories = typeof expenseCategories.$inferSelect;
