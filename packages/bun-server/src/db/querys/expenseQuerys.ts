import { desc, eq, inArray, sql, sum } from "drizzle-orm";
import { db } from "../../config/db_config";
import {
  expenseCategories,
  expenses,
  incomeCategories,
  incomes,
  type InsertExpenseCategories,
  type InsertExpenses,
  type InsertIncomeCategories,
  type InsertIncomes,
  type SelectExpenseCategories,
  type SelectExpenses,
  type SelectIncomeCategories,
  type SelectIncomes,
} from "../schema/expenses";

// expenses
export const insertExpense = (expense: InsertExpenses) => {
  return db.insert(expenses).values(expense).returning();
};

export const getAllExpenses = (): SelectExpenses[] => {
  return db.select().from(expenses).orderBy(desc(expenses.date)).all();
};

export const deleteExpense = (ids: number[]) => {
  return db
    .delete(expenses)
    .where(inArray(expenses.expense_id, ids))
    .returning({ deletedId: expenses.expense_id });
};

export const sumOfExpense = () => {
  return db
    .select({ total: sql`sum(${expenses.amount})`.mapWith(Number) })
    .from(expenses);
};

// income
export const insertIncome = (income: InsertIncomes) => {
  return db.insert(incomes).values(income).returning();
};

export const getAllIncome = (): SelectIncomes[] => {
  return db.select().from(incomes).orderBy(desc(incomes.date)).all();
};

export const deleteIncome = (ids: number[]) => {
  return db
    .delete(incomes)
    .where(inArray(incomes.income_id, ids))
    .returning({ deletedId: incomes.income_id });
};

export const sumOfIncome = () => {
  return db
    .select({ total: sql`sum(${incomes.amount})`.mapWith(Number) })
    .from(incomes);
};

// income category
export const insertIncomeCategories = (
  incomeCategory: InsertIncomeCategories
) => {
  return db.insert(incomeCategories).values(incomeCategory).returning();
};

export const getAllIncomeCategories = (): SelectIncomeCategories[] => {
  return db.select().from(incomeCategories).orderBy(desc(expenses.date)).all();
};

export const deleteIncomeCategories = (id: number) => {
  return db
    .delete(incomeCategories)
    .where(eq(incomeCategories.category_id, id))
    .returning();
};

// expense category
export const insertExpenseCategories = (
  expenseCategory: InsertExpenseCategories
) => {
  return db.insert(expenseCategories).values(expenseCategory).returning();
};

export const getAllExpenseCategories = (): SelectExpenseCategories[] => {
  return db.select().from(expenseCategories).orderBy(desc(expenses.date)).all();
};

export const deleteExpensesCategories = (id: number) => {
  return db
    .delete(expenseCategories)
    .where(eq(expenseCategories.category_id, id))
    .returning();
};
