export type TransactionType = "credit" | "debit";

export type IncomeType = {
  date: string;
  type: TransactionType;
  income_id: number;
  amount: string;
  source: string;
  category_id: number | null | undefined;
};
export type ExpenseType = {
  expense_id: number;
  date: string;
  type: TransactionType;
  amount: string;
  merchant: string;
  category_id?: number | null | undefined;
};