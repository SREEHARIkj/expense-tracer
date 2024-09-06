import SimpleForm from "@/components/SimpleForm";
import { DatePicker, DatePickerResponse } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { withAuthCheck } from "@/lib/auth-utility/withAuthCheck";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChangeEvent, useState, useTransition } from "react";

interface IncomeDetails {
  source: string;
  amount: string;
  date: string;
}

export const Route = createFileRoute("/income/CreateIncome")({
  component: withAuthCheck(CreateIncome),
});

function CreateIncome() {
  const navigate = useNavigate();
  const initialState = {
    source: "",
    amount: "",
    date: "",
  };
  const [_, startTransition] = useTransition();
  const [incomeDetails, setExpenseDetails] =
    useState<IncomeDetails>(initialState);

  const incomeMutation = useMutation({
    mutationFn: postIncomeDetails,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  async function postIncomeDetails() {
    const res = await api.credit.$post({
      form: incomeDetails,
    });
    return await res.json();
  }

  const handleExpenseData = (
    e: ChangeEvent<HTMLInputElement> | DatePickerResponse
  ) => {
    const { name, value } = e.target;
    startTransition(() => {
      setExpenseDetails((prev: IncomeDetails) => ({
        ...prev,
        [name]: value,
      }));
    });
  };

  const handleBack = () => {
    setExpenseDetails(initialState);
    navigate({ to: "/income", viewTransition: true });
  };

  return (
    <SimpleForm
      title="Income"
      description="Your income details"
      handleBack={handleBack}
      handleSubmit={() => incomeMutation.mutate()}
    >
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="source">Source</Label>
          <Input
            id="source"
            name="source"
            placeholder="Income Source"
            value={incomeDetails.source}
            onChange={handleExpenseData}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            name="amount"
            value={incomeDetails.amount}
            placeholder="Income Amount"
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
