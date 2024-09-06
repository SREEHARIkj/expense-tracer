import SimpleForm from "@/components/SimpleForm";
import { DatePicker, DatePickerResponse } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { withAuthCheck } from "@/lib/auth-utility/withAuthCheck";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChangeEvent, useState, useTransition } from "react";

interface ExpenseDetails {
  merchant: string;
  amount: string;
  date: string;
}
export const Route = createFileRoute("/expense/CreateExpense")({
  component: withAuthCheck(CreateExpense),
});

function CreateExpense() {
  const navigate = useNavigate();
  const initialState = {
    amount: "",
    merchant: "",
    date: "",
  };
  const [_, startTransition] = useTransition();
  const [expenseDetails, setExpenseDetails] =
    useState<ExpenseDetails>(initialState);

  const expenseMutation = useMutation({
    mutationFn: postExpenseDetails,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  async function postExpenseDetails() {
    const res = await api.debit.$post({
      form: expenseDetails,
    });
    return await res.json();
  }

  const handleExpenseData = (
    e: ChangeEvent<HTMLInputElement> | DatePickerResponse
  ) => {
    const { name, value } = e.target;
    startTransition(() => {
      setExpenseDetails((prev: ExpenseDetails) => ({
        ...prev,
        [name]: value,
      }));
    });
  };

  const handleBack = () => {
    setExpenseDetails(initialState);
    navigate({ to: "/expense", viewTransition: true });
  };

  return (
    <SimpleForm
      title="Expense"
      description="Your expense details"
      handleBack={handleBack}
      handleSubmit={() => expenseMutation.mutate()}
    >
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="merchant">Expense</Label>
          <Input
            id="merchant"
            name="merchant"
            placeholder="Expense"
            value={expenseDetails.merchant}
            onChange={handleExpenseData}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            name="amount"
            value={expenseDetails.amount}
            placeholder="Expense Amount"
            onChange={handleExpenseData}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="amount">Date</Label>
          <DatePicker onSelectDate={handleExpenseData} />
        </div>
      </div>
    </SimpleForm>
  );
}
