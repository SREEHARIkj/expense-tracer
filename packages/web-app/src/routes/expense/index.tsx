import { createFileRoute } from "@tanstack/react-router";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { withAuthCheck } from "@/lib/auth-utility/withAuthCheck";
import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

export const Route = createFileRoute("/expense/")({
  component: withAuthCheck(ExpensesPage),
});

function ExpensesPage(): JSX.Element {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { isError, isLoading, data, error } = useQuery({
    queryKey: ["expensesList"],
    queryFn: getExpenseDetails,
  });

  const deleteIncomeMutation = useMutation({
    mutationFn: deleteExpenseData,
    onSuccess() {
      toast({
        title: "Success",
        description: "Deleted successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["expensesList"] });
      setSelectedIds([]);
    },
  });

  function onErrorRes(data: { error: string }): void {
    if ("error" in data) throw new Error(data?.error);
    throw new Error("Server error");
  }

  async function getExpenseDetails() {
    const res = await api.debit.$get();

    const data = await res.json();
    if (!res.ok) {
      onErrorRes(data as { error: string });
    }
    return data;
  }

  function getSubTotal(): number | undefined {
    if (Array.isArray(data)) {
      return data.reduce((acc, curr) => acc + (Number(curr.amount) ?? 0), 0);
    }
    return undefined;
  }

  async function deleteExpenseData() {
    const res = await api.debit.$delete({
      json: {
        ids: selectedIds,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      onErrorRes(data as { error: string });
    }

    return data;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  if (isLoading) {
    return <Skeleton className="w-full h-[500px] m-4 rounded-0" />;
  }

  const handleCheckBox = (id: number) => {
    setSelectedIds((prev) => {
      if (prev?.includes?.(id)) {
        return prev?.filter((item) => item !== id);
      }
      return !prev.length ? [id] : [...prev, id];
    });
  };

  return (
    <div className="m-4">
      <div className="w-full py-5">
        <Button
          onClick={() =>
            navigate({ to: "/expense/CreateExpense", viewTransition: true })
          }
        >
          Create Expense
        </Button>
      </div>
      <div className="relative w-full overflow-hidden">
        <div
          className={cn(
            `w-full transition-all duration-500 ease-in-out `,
            selectedIds.length ? "w-5/6" : ""
          )}
        >
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead />
                <TableHead className="w-[100px]">Expense Id</TableHead>
                <TableHead>Expense</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(data) &&
                data?.map?.((debitedData) => (
                  <TableRow key={debitedData.expense_id}>
                    <TableCell>
                      <Checkbox
                        onClick={() => handleCheckBox(debitedData.expense_id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {debitedData.expense_id}
                    </TableCell>
                    <TableCell>{debitedData.merchant}</TableCell>
                    <TableCell>
                      {debitedData?.date
                        ? new Date(debitedData?.date).toUTCString()
                        : ""}
                    </TableCell>
                    <TableCell className="text-right">
                      {debitedData.amount}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell />
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">$ {getSubTotal()}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
        <Button
          className={`absolute top-0 right-5 w-24 transition-all duration-500 ease-in-out ${
            selectedIds.length ? "opacity-100" : "opacity-0 -right-24"
          }`}
          onClick={() => {
            deleteIncomeMutation.mutate();
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
